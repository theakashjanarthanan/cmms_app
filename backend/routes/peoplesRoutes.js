// backend/routes/peoplesRoutes.js

const express = require('express');
const { getAllUsers } = require('../controllers/peoplesController');
const router = express.Router();

// Route to fetch all users
router.get('/', getAllUsers);

module.exports = router;
