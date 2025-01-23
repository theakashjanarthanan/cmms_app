// backend/controllers/technicianController.js

const User = require('../models/User');

// Get active technicians (users with 'Technician' role)
const getActiveTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ role: 'Technician' });
    res.status(200).json(technicians);
  } catch (error) {
    console.error('Error fetching active technicians:', error);
    res.status(500).json({ message: 'Failed to fetch technicians' });
  }
};

module.exports = { getActiveTechnicians };