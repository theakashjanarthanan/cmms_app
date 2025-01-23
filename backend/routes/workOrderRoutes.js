// backend/routes/workOrderRoutes.js

const express = require('express');
const router = express.Router();
const WorkOrder = require('../models/WorkOrder');  
const CompletedWorkOrder = require('../models/CompletedWorkOrder');  
const { createWorkOrder , getWorkOrders , updateApprovalStatus , updateWorkOrder , deleteWorkOrder } = require('../controllers/workOrderController');

router.post('/', createWorkOrder);

router.get('/', getWorkOrders); 

// Update the approval status of a work order
router.patch('/:orderId/approval-status', updateApprovalStatus);

// Update work order
router.put('/:orderId', updateWorkOrder);

// DELETE route for deleting work order
router.delete('/:orderId', deleteWorkOrder); 

router.put('/mark-as-completed/:id', async (req, res) => {
  const workOrderId = req.params.id;

  try {
    // Find the work order by ID
    const workOrder = await WorkOrder.findById(workOrderId);
    if (!workOrder) {
      return res.status(404).json({ error: 'Work order not found' });
    }

    // Create a new completed work order
    const completedWorkOrder = new CompletedWorkOrder({
      ...workOrder.toObject(),
      completedAt: new Date(), // Add completed timestamp
    });

    // Save the completed work order
    await completedWorkOrder.save();

    // Remove the work order from the original collection
    await WorkOrder.deleteOne({ _id: workOrderId });

    // Respond with success
    res.status(200).json({ message: 'Work order marked as completed successfully!' });
  } catch (error) {
    console.error('Error in mark-as-completed:', error);
    res.status(500).json({ error: 'Error marking work order as completed' });
  }
});


module.exports = router;
