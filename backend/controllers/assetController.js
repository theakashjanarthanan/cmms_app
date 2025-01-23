// backend/controllers/assetController.js

const Asset = require('../models/Asset');

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

// Update an existing asset
const updateAsset = async (req, res) => {
  try {
    const { assetID } = req.params;
    const updatedAssetData = req.body;

    const updatedAsset = await Asset.findOneAndUpdate(
      { assetID },
      updatedAssetData,
      { new: true }
    );

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
    try {
      const { assetID } = req.params;
  
      const updatedAsset = await Asset.findOneAndUpdate(
        { assetID },
        { deletedAt: new Date() }, // Set the `deletedAt` timestamp instead of deleting
        { new: true }
      );
  
      if (!updatedAsset) {
        return res.status(404).json({ message: 'Asset not found' });
      }
  
      res.status(200).json({ message: 'Asset deleted successfully', asset: updatedAsset });
    } catch (error) {
      console.error('Error deleting asset:', error);
      res.status(500).json({ error: 'Failed to delete asset' });
    }
  };

module.exports = { getAllAssets, createAsset , updateAsset , deleteAsset };
