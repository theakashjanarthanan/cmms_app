// backend/controllers/workOrderController.js

const WorkOrder = require('../models/WorkOrder');
const Asset = require('../models/Asset');

// Create Work Order
const createWorkOrder = async (req, res) => {
  try {
    const { asset, team, ...workOrderData } = req.body;  
    const newWorkOrder = new WorkOrder(workOrderData);

    if (asset) {
      newWorkOrder.asset = asset;
    }
    if (team) {
      newWorkOrder.team = team;  
    }

    await newWorkOrder.save();
    res.status(201).json({ message: 'Work order created successfully', workOrder: newWorkOrder });
  } catch (error) {
    console.error('Error creating work order:', error);
    res.status(500).json({ error: 'Failed to create work order' });
  }
};

// Fetch all work orders
const getWorkOrders = async (req, res) => {
  try {
    const workOrders = await WorkOrder.find()
      .populate('worker', 'fullName email')
      .populate('asset', 'name')
      .populate({
        path: 'team',
        populate: {
          path: 'workers',
          select: 'fullName email', 
        },
      });

    const formattedWorkOrders = workOrders.map(order => ({
      ...order.toObject(),
      formattedStartDate: order.startDate
        ? new Date(order.startDate).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      formattedDueDate: order.dueDate
        ? new Date(order.dueDate).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      formattedCreatedAt: order.createdAt
        ? new Date(order.createdAt).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
      formattedUpdatedAt: order.updatedAt
        ? new Date(order.updatedAt).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null,
    }));

    res.json(formattedWorkOrders);
  } catch (error) {
    console.error('Error fetching work orders:', error);
    res.status(500).json({ message: 'Error fetching work orders', error });
  }
};


// Update the approval status of a work order
const updateApprovalStatus = async (req, res) => {
  const { orderId } = req.params;
  const { approvalStatus } = req.body;

  // Validate approval status
  if (!['Approved', 'Pending', 'On Hold'].includes(approvalStatus)) {
    return res.status(400).json({ message: 'Invalid approval status' });
  }

  try {
    const workOrder = await WorkOrder.findByIdAndUpdate(
      orderId,
      { approvalStatus },
      { new: true } // Return updated document
    );

    if (!workOrder) {
      return res.status(404).json({ message: 'Work order not found' });
    }

    res.json(workOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating approval status', error });
  }
};

// Update Work Order
const updateWorkOrder = async (req, res) => {
  const { orderId } = req.params;
  const updateData = req.body;

  try {
    const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true } // Return updated document
    );

    if (!updatedWorkOrder) {
      return res.status(404).json({ message: 'Work order not found' });
    }

    res.json({ message: 'Work order updated successfully', workOrder: updatedWorkOrder });
  } catch (error) {
    console.error('Error updating work order:', error);
    res.status(500).json({ error: 'Failed to update work order' });
  }
};

// Delete Work Order
const deleteWorkOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const workOrder = await WorkOrder.findByIdAndDelete(orderId);

    if (!workOrder) {
      return res.status(404).json({ message: 'Work order not found' });
    }

    res.json({ message: 'Work order deleted successfully' });
  } catch (error) {
    console.error('Error deleting work order:', error);
    res.status(500).json({ error: 'Failed to delete work order' });
  }
};


module.exports = {
  createWorkOrder,
  getWorkOrders,
  updateApprovalStatus,
  updateWorkOrder,
  deleteWorkOrder,
};

 