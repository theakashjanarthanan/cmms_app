// backend\routes\preventiveMaintenanceRoutes.js

const express = require('express');
const router = express.Router();
const {
  createPM,
  getAllPMs,
  fetchTechnicians, 
  getPMById,
  updatePM,
  deletePM,
  } = require('../controllers/preventiveMaintenanceController');

// Create Preventive Maintenance
router.post('/', createPM);

// Get all Preventive Maintenance
router.get('/getAll', getAllPMs);

// Fetch active technicians (new route)
router.get('/technicians', fetchTechnicians);

// Get Preventive Maintenance by ID
router.get('/:pmId', getPMById);

// Update Preventive Maintenance
router.put('/update', updatePM);

// Delete Preventive Maintenance
router.delete('/:pmId', deletePM);

module.exports = router;
