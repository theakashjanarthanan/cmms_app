// backend/routes/technicianRoutes.js

const express = require('express');
const router = express.Router();
const { getActiveTechnicians } = require('../controllers/technicianController');

// Route to get active technicians
router.get('/active-technicians', getActiveTechnicians);

module.exports = router;