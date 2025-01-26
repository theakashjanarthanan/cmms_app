// backend\routes\assetRoutes.js

const express = require('express');
const { createAsset, getAllAssets, getSingleAsset, updateAsset , deleteAsset} = require('../controllers/assetController');
const router = express.Router();

// POST: /api/asset-management - Route to create a new asset
router.post('/', createAsset);

// GET:/api/asset-management  - Fetch all assets  
router.get('/', getAllAssets);

// GET: Fetch a single asset by ID
router.get('/:id', getSingleAsset);  

// PUT: /api/asset-management/:id - Update an existing asset
router.put('/:id', updateAsset); 

// DELETE: /api/asset-management/:id - Delete an asset
router.delete('/:id', deleteAsset);

module.exports = router;
