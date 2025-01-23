// backend\routes\parts.js

const express = require('express');
const { createPart, getParts , updatePartQuantity, deletePart } = require('../controllers/partsController');

const router = express.Router();

// POST /api/parts - Create a new part
router.post('/', createPart);

// GET /api/parts - Fetch all parts
router.get('/', getParts);

// PATCH /api/parts/:partId - Update part quantity
router.patch('/:partId', updatePartQuantity);

// DELETE /api/parts/:partId - Delete a part
router.delete('/:partId', deletePart);

module.exports = router;
