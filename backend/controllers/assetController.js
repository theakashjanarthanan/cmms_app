// backend/controllers/assetController.js

const mongoose = require('mongoose');
const Asset = require('../models/Asset');

// Create a new asset
const createAsset = async (req, res) => {
  try {
    const assetData = req.body;
    const newAsset = new Asset(assetData);
    await newAsset.save();
    res.status(201).json({ message: 'Asset created successfully', asset: newAsset });
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
};

// Fetch all assets
const getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 }); // Sort by most recent
    res.status(200).json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ message: 'Failed to fetch assets' });
  }
};

// Fetch a single asset by ID
const getSingleAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);  // Find the asset by ID
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    res.status(200).json(asset);  // Send the asset data back as a response
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching asset' });
  }
};

// Update an existing asset
const updateAsset = async (req, res) => {
  try {
    const { id } = req.params; // Retrieve MongoDB Object ID
    const updatedAssetData = req.body;

    const updatedAsset = await Asset.findByIdAndUpdate(id, updatedAssetData, { new: true });

    if (!updatedAsset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.status(200).json({ message: 'Asset updated successfully', asset: updatedAsset });
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ error: 'Failed to update asset' });
  }
};

// Delete an asset  
const deleteAsset = async (req, res) => {
  const { id } = req.params;  // Use params to get the _id from the URL

  // Check if id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ObjectId format." });
  }

  try {
    const asset = await Asset.findByIdAndDelete(id);  // Delete using the MongoDB _id
    if (!asset) {
      return res.status(404).json({ message: "Asset not found." });
    }
    res.status(200).json({ message: "Asset deleted successfully." });
  } catch (error) {
    console.error("Error deleting asset:", error);
    res.status(500).json({ message: "Error deleting asset." });
  }
};

module.exports = {createAsset, getAllAssets, getSingleAsset , updateAsset, deleteAsset };