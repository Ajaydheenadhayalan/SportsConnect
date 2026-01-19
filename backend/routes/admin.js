import express from 'express';
import User from '../models/User.js';
import { verifyToken, requireAdmin, generateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/admin/login
 * Admin login with credentials from environment variables
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        // Check against environment variables
        if (
            username === process.env.ADMIN_USERNAME &&
            password === process.env.ADMIN_PASSWORD
        ) {
            // Create a temporary admin user object for token generation
            // In production, you might want to have a real admin user in the database
            const adminToken = generateToken('admin-user-id');

            return res.json({
                success: true,
                message: 'Admin login successful',
                token: adminToken,
                admin: {
                    username: process.env.ADMIN_USERNAME,
                    role: 'admin'
                }
            });
        }

        res.status(401).json({
            success: false,
            message: 'Invalid admin credentials'
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Admin login failed'
        });
    }
});

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const now = new Date();
        const fifteenMinutesAgo = new Date(now - 15 * 60 * 1000);
        const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

        const [
            totalUsers,
            activeUsers,
            onlineUsers,
            newUsersToday,
            newUsersThisWeek
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isActive: true }),
            User.countDocuments({ lastLogin: { $gte: fifteenMinutesAgo } }),
            User.countDocuments({ createdAt: { $gte: oneDayAgo } }),
            User.countDocuments({ createdAt: { $gte: oneWeekAgo } })
        ]);

        res.json({
            success: true,
            stats: {
                totalUsers,
                activeUsers,
                onlineUsers,
                newUsersToday,
                newUsersThisWeek,
                inactiveUsers: totalUsers - activeUsers
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get statistics'
        });
    }
});

/**
 * GET /api/admin/users
 * Get all users with pagination and filters
 */
router.get('/users', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search = '',
            status = 'all',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build query
        const query = {};

        // Search filter
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Status filter
        if (status === 'active') {
            query.isActive = true;
        } else if (status === 'inactive') {
            query.isActive = false;
        } else if (status === 'online') {
            const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
            query.lastLogin = { $gte: fifteenMinutesAgo };
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Sort
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query
        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            User.countDocuments(query)
        ]);

        res.json({
            success: true,
            users,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get users'
        });
    }
});

/**
 * GET /api/admin/users/:id
 * Get detailed user information
 */
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

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

/**
 * PUT /api/admin/users/:id
 * Update user (admin only)
 */
router.put('/users/:id', async (req, res) => {
    try {
        const { isActive, ...otherUpdates } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                ...otherUpdates,
                ...(isActive !== undefined && { isActive })
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
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user'
        });
    }
});

/**
 * DELETE /api/admin/users/:id
 * Delete user (admin only)
 */
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
});

/**
 * GET /api/admin/export
 * Export users to JSON/CSV
 */
router.get('/export', async (req, res) => {
    try {
        const { format = 'json' } = req.query;

        const users = await User.find().select('-password').lean();

        if (format === 'csv') {
            // Convert to CSV
            const headers = ['ID', 'Full Name', 'Username', 'Email', 'Phone', 'Active', 'Joined', 'Last Login'];
            const rows = users.map(u => [
                u._id,
                u.fullName,
                u.username,
                u.email,
                u.phone || '',
                u.isActive ? 'Yes' : 'No',
                new Date(u.createdAt).toLocaleDateString(),
                new Date(u.lastLogin).toLocaleDateString()
            ]);

            const csv = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
            res.send(csv);
        } else {
            // Return JSON
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename=users.json');
            res.json({
                success: true,
                users,
                exportedAt: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Export users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export users'
        });
    }
});

export default router;
