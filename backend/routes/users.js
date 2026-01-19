import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/users/profile
 * Get current user profile (requires authentication)
 */
router.get('/profile', verifyToken, async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile'
        });
    }
});

/**
 * PUT /api/users/profile
 * Update user profile (requires authentication)
 */
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { fullName, phone, avatar, location, sports, bio } = req.body;

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                ...(fullName && { fullName }),
                ...(phone !== undefined && { phone }),
                ...(avatar && { avatar }),
                ...(location && { location }),
                ...(sports && { sports }),
                ...(bio !== undefined && { bio })
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
});

/**
 * GET /api/users/:id
 * Get user by ID (public)
 */
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -email -phone');

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
        res.status(500).json({
            success: false,
            message: 'Failed to get user'
        });
    }
});

export default router;
