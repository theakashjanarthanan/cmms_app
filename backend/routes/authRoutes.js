// backend\routes\authRoutes.js

const express = require('express');
const { registerUser, loginUser , getUsers , deleteUser , assignRole } = require('../controllers/authController');
const router = express.Router();

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get all registered users
router.get('/users', getUsers);

// DELETE user by ID
router.delete('/users/:id', deleteUser);

// Handling User Role Updates
router.put('/users/:id/assign-role', assignRole);

module.exports = router;
