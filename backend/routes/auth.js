import express from 'express';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { generateToken } from '../middleware/auth.js';
import { sendOTPEmail, sendWelcomeEmail } from '../utils/emailService.js';

const router = express.Router();

/**
 * POST /api/auth/request-otp
 * Request OTP for email verification
 */
router.post('/request-otp', async (req, res) => {
    try {
        const { email, fullName } = req.body;

        if (!email || !fullName) {
            return res.status(400).json({
                success: false,
                message: 'Email and full name are required'
            });
        }

        // Generate 4-digit OTP
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

        // Delete any existing OTP for this email
        await OTP.deleteMany({ email: email.toLowerCase() });

        // Save new OTP
        const otp = new OTP({
            email: email.toLowerCase(),
            otp: otpCode
        });
        await otp.save();

        // Send OTP email
        try {
            await sendOTPEmail(email, fullName, otpCode);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // For development: still return success but log the OTP
            console.log(`📧 DEV MODE - OTP for ${email}: ${otpCode}`);
        }

        res.json({
            success: true,
            message: 'OTP sent successfully',
            devOTP: process.env.NODE_ENV === 'development' ? otpCode : undefined // Only in dev mode
        });
    } catch (error) {
        console.error('Request OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP'
        });
    }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP code
 */
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        // Find OTP record
        const otpRecord = await OTP.findOne({ email: email.toLowerCase() });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired or not found'
            });
        }

        // Compare OTP
        const isValid = await otpRecord.compareOTP(otp);

        if (!isValid) {
            // Allow fallback OTP '1234' in development
            if (process.env.NODE_ENV === 'development' && otp === '1234') {
                await OTP.deleteOne({ _id: otpRecord._id });
                return res.json({
                    success: true,
                    message: 'OTP verified (dev mode)'
                });
            }

            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Delete OTP after successful verification
        await OTP.deleteOne({ _id: otpRecord._id });

        res.json({
            success: true,
            message: 'OTP verified successfully'
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify OTP'
        });
    }
});

/**
 * POST /api/auth/check-username
 * Check if username is available
 */
router.post('/check-username', async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: 'Username is required'
            });
        }

        const cleanUsername = username.trim().toLowerCase();

        if (cleanUsername.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Username must be at least 3 characters'
            });
        }

        const existingUser = await User.findOne({ username: cleanUsername });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username already taken'
            });
        }

        res.json({
            success: true,
            message: 'Username is available'
        });
    } catch (error) {
        console.error('Check username error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check username'
        });
    }
});

/**
 * POST /api/auth/signup
 * Complete user registration
 */
router.post('/signup', async (req, res) => {
    try {
        const { fullName, username, email, phone, password, avatar, location, sports, bio } = req.body;

        // Validate required fields
        if (!fullName || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Full name, username, email, and password are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or username'
            });
        }

        // Create new user
        const user = new User({
            fullName,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            phone: phone || '',
            password,
            avatar: avatar || 'default',
            location,
            sports: sports || [],
            bio: bio || ''
        });

        await user.save();

        // Send welcome email (non-blocking)
        sendWelcomeEmail(email, fullName).catch(err =>
            console.error('Welcome email failed:', err)
        );

        // Generate token
        const token = generateToken(user._id);

        // Return user without password
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Signup error:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to register user'
        });
    }
});

/**
 * POST /api/auth/login
 * User login
 */
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username/email and password are required'
            });
        }

        // Find user by username or email
        const user = await User.findOne({
            $or: [
                { username: identifier.toLowerCase() },
                { email: identifier.toLowerCase() }
            ]
        }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is inactive'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Return user without password
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
});

/**
 * POST /api/auth/logout
 * User logout (client-side token removal)
 */
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logout successful'
    });
});

/**
 * GET /api/auth/me
 * Get current user (requires authentication)
 */
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
});

export default router;
