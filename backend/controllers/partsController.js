// backend\controllers\partsController.js

const Part = require('../models/Part');

// Create a new part
exports.createPart = async (req, res) => {
  try {
    const { 
      name, 
      partNumber, 
      description, 
      assignedWorker, 
      assignedTeams, 
      type, 
      location, 
      additionalInfo, 
      cost, 
      availableQuantity, 
      maxQuantity, 
      minQuantity 
    } = req.body;

    const newPart = new Part({
      name,
      partNumber,
      description,
      assignedWorker,
      assignedTeams,
      type,
      location,
      additionalInfo,
      cost,
      availableQuantity,
      maxQuantity,
      minQuantity,
    });

    const savedPart = await newPart.save();
    res.status(201).json({ message: 'Part created successfully', part: savedPart });
  } catch (error) {
    res.status(500).json({ message: 'Error creating part', error });
  }
};

// Function to calculate part status
const calculateStatus = (availableQuantity, minQuantity, maxQuantity) => {
  if (availableQuantity === 0) return 'Out of Stock';
  if (availableQuantity < minQuantity) return 'Low Stock';
  if (availableQuantity > maxQuantity) return 'In Stock';
  return 'In Stock'; // Default status
};

// Fetch all parts
exports.getParts = async (req, res) => {
  try {
    const parts = await Part.find().sort({ createdAt: -1 });
    
    // Add the status to each part
    const partsWithStatus = parts.map(part => ({
      ...part.toObject(),
      status: calculateStatus(part.availableQuantity, part.minQuantity, part.maxQuantity)
    }));

    res.status(200).json(partsWithStatus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parts', error });
  }
};

// Update part quantity
exports.updatePartQuantity = async (req, res) => {
  try {
    const { partId } = req.params;
    const { availableQuantity } = req.body;

    const updatedPart = await Part.findByIdAndUpdate(
      partId,
      { availableQuantity },
      { new: true } // Return the updated document
    );

    if (!updatedPart) {
      return res.status(404).json({ message: 'Part not found' });
    }

    res.status(200).json({ message: 'Quantity updated successfully', part: updatedPart });
  } catch (error) {
    res.status(500).json({ message: 'Error updating quantity', error });
  }
};

// Function to delete a part by ID
exports.deletePart = async (req, res) => {
  try {
    const { partId } = req.params;
    const deletedPart = await Part.findByIdAndDelete(partId);

    if (!deletedPart) {
      return res.status(404).json({ message: 'Part not found' });
    }

    res.status(200).json({ message: 'Part deleted successfully', part: deletedPart });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting part', error });
  }
};

