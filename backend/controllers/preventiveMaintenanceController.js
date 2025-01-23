// controllers/preventiveMaintenanceController.js

const PreventiveMaintenance = require('../models/preventiveMaintenanceModel');
const Technician = require('../models/User'); 

// Create new Preventive Maintenance
exports.createPM = async (req, res) => {
  try {
    const {
      asset,
      location,
      startDate,
      dueDate,
      worker,
      team,
      title,
      displayName,
      description,
      priority,
      category,
      status
    } = req.body;

    const newPM = new PreventiveMaintenance({
      asset,
      location,
      startDate,
      dueDate,
      worker,   
      team,
      title,
      displayName,
      description,
      priority,
      category,
      status
    });

    await newPM.save();
    return res.status(201).json({ message: 'Preventive Maintenance created successfully!', newPM });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create Preventive Maintenance.' });
  }
};

// Fetch all Preventive Maintenance
exports.getAllPMs = async (req, res) => {
  try {
    const pms = await PreventiveMaintenance.find()
      .populate('asset')
      .populate('worker')
      .populate('team')
      .select('displayName title asset location category worker team priority createdAt updatedAt');  
    
    res.status(200).json(pms);
  } catch (error) {
    console.error('Error fetching PMs:', error);
    res.status(500).json({ message: 'Failed to fetch preventive maintenance records' });
  }
};

// Fetch active technicians
exports.fetchTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.find({ active: true }); // Assuming `active` is a field in the model
    res.status(200).json(technicians);
  } catch (error) {
    console.error("Error fetching technicians:", error);
    res.status(500).json({ message: "Error fetching technicians." });
  }
};

// View PM
exports.getPMById = async (req, res) => {
  try {
    const { pmId } = req.params;

    const pm = await PreventiveMaintenance.findById(pmId)
      .populate('asset')
      .populate('worker')
      .populate('team')
    
    if (!pm) {
      return res.status(404).json({ message: 'Preventive Maintenance record not found.' });
    }

    res.status(200).json(pm);
  } catch (error) {
    console.error('Error fetching PM by ID:', error);
    res.status(500).json({ message: 'Failed to fetch Preventive Maintenance details.' });
  }
};

// Update Preventive Maintenance
exports.updatePM = async (req, res) => {
  try {
    const { pmId, title, displayName, description, startDate, dueDate, priority, location, category, pmStatus } = req.body;
    
    const updatedPM = await PreventiveMaintenance.findByIdAndUpdate(
      pmId,
      {
        title,
        displayName,
        description,
        startDate,
        dueDate,
        priority,
        location,
        category,
        dateUpdated: Date.now(),
      },
      { new: true }
    );

    if (!updatedPM) {
      return res.status(404).json({ message: 'Preventive Maintenance record not found' });
    }

    return res.status(200).json({ message: 'Preventive Maintenance updated successfully', updatedPM });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update Preventive Maintenance record' });
  }
};

// Delete Preventive Maintenance
exports.deletePM = async (req, res) => {
  try {
    const { pmId } = req.params;

    const deletedPM = await PreventiveMaintenance.findByIdAndDelete(pmId);
    
    if (!deletedPM) {
      return res.status(404).json({ message: 'Preventive Maintenance record not found.' });
    }

    res.status(200).json({ message: 'Preventive Maintenance deleted successfully!' });
  } catch (error) {
    console.error('Error deleting PM:', error);
    res.status(500).json({ message: 'Failed to delete Preventive Maintenance.' });
  }
};
 
