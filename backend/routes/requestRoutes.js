// backend/routes/requestRoutes.js

const express = require('express');
const { createRequest, getRequests, updateRequest, updateRequestsApprovalStatus, deleteRequest , convertToWorkOrder  } = require('../controllers/requestController');
const router = express.Router();

router.post('/', createRequest);

router.get('/', getRequests);

router.put('/:id', updateRequest); 

router.delete('/:id', deleteRequest);

router.patch('/:id/status', updateRequestsApprovalStatus);

router.patch('/:id/convert-to-work-order', convertToWorkOrder);

module.exports = router;
