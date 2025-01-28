// backend\routes\assetRoutes.js

const express = require('express');
const { createAsset, getAllAssets, getSingleAsset, updateAsset , deleteAsset  } = require('../controllers/assetController');
const router = express.Router();

// POST: /api/assets - Route to create a new asset
router.post('/', createAsset);

// GET:/api/assets  - Fetch all assets  
router.get('/', getAllAssets);

// GET: Fetch a single asset by ID
router.get('/:id', getSingleAsset);  

// PUT: /api/assets/:id - Update an existing asset
router.put('/:id', updateAsset); 

// DELETE: /api/assets/:id - Delete an asset
router.delete('/:id', deleteAsset);


module.exports = router;
