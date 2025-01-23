// backend\controllers\requestController.js

const Request = require('../models/Request');
const moment = require('moment');

// Create new request
exports.createRequest = async (req, res) => {
  try {
    const { title, description, priority, status = 'Pending' } = req.body;
    const newRequest = new Request({ title, description, priority, status });
    await newRequest.save();

    newRequest.createdAt = moment(newRequest.createdAt).format('MM/DD/YYYY hh:mm A');
    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "Failed to create request" });
  }
};

// Get all requests
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find();

    const formattedRequests = requests.map((request) => {
      request.createdAt = moment(request.createdAt).format('MM/DD/YYYY hh:mm A');
      return request;
    });

    res.status(200).json(formattedRequests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

// Update an existing request
exports.updateRequest = async (req, res) => {
  const { title, description, priority, status } = req.body;
  const { id } = req.params;

  try {
    const request = await Request.findByIdAndUpdate(
      id,
      { title, description, priority, status },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.updatedAt = moment(request.updatedAt).format('MM/DD/YYYY hh:mm A');
    res.status(200).json(request);
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ message: "Failed to update request" });
  }
};

// Update Approval Status
exports.updateRequestsApprovalStatus = async (req, res) => {
  const { id } = req.params; // Get request ID from URL params
  const { status } = req.body; // Get new status from the request body

  try {
    // Find the request and update the status
    const request = await Request.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(request); // Return the updated request
  } catch (error) {
    console.error("Error updating approval status:", error);
    res.status(500).json({ message: "Failed to update approval status" });
  }
};

// Delete a request
exports.deleteRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await Request.findByIdAndDelete(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ message: "Failed to delete request" });
  }
};

exports.convertToWorkOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await Request.findByIdAndUpdate(
      id,
      { status: 'Converted as Work Order' },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json(request); // Return updated request
  } catch (error) {
    console.error('Error converting to work order:', error);
    res.status(500).json({ message: 'Failed to update request status' });
  }
};