// backend/controllers/peoplesController.js

const User = require('../models/User');

// Controller to get all registered users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude passwords for security
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

module.exports = { getAllUsers };
