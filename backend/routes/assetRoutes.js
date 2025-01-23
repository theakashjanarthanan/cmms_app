// backend\routes\assetRoutes.js

const express = require('express');
const { getAllAssets, createAsset , updateAsset , deleteAsset} = require('../controllers/assetController');
const router = express.Router();

// POST: /api/asset-management
router.post('/', createAsset);

// GET: Fetch all assets
router.get('/', getAllAssets);

// PUT: /api/asset-management/:assetID - Update an existing asset
router.put('/:assetID', updateAsset);

// DELETE: /api/asset-management/:assetID - Delete an asset
router.delete('/:assetID', deleteAsset);

module.exports = router;
