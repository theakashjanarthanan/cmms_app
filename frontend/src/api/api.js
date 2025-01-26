// frontend/src/api/api.js

import axios from 'axios';

// Base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',  
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Asset Management API Endpoints
export const createAsset = async (assetData) => {
  try {
    const response = await API.post('/assets', assetData);
    return response.data;
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
};

// Peoples and Team API Endpoints
export const fetchUsers = async () => {
  try {
    const response = await API.get('/peoples');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Teams API Endpoints
// Create Teams API
export const createTeam = async (teamData) => {
  try {
    const response = await API.post('/teams/create', teamData); // POST request
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error creating team:', error);
    throw error; // Throw error to propagate it back to the caller
  }
};

// Fetch Teams API
export const fetchTeams = async () => {
  try {
    const response = await API.get('/teams'); // Make a GET request to the backend API
    return response.data; // Return the list of teams
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error; // Throw an error if something goes wrong
  }
};

// Update Team API
export const updateTeam = async (teamData) => {
  try {
    const response = await API.put('/teams/update', teamData); // PUT request
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error updating team:', error);
    throw error; // Propagate the error to the caller
  }
};

//Delete Team API
export const deleteTeam = async (teamId) => {
  try {
    const response = await API.delete('/teams/delete', { data: { teamId } }); // DELETE request with teamId
    return response.data;  // Return the success response message
  } catch (error) {
    console.error('Error deleting team:', error);
    throw error;  // Throw the error for further handling in the frontend
  }
};

// Technician Portal API Endpoints 
export const fetchActiveTechnicians = async () => {
  try {
    const response = await API.get('/technician-portal/active-technicians');
    return response.data;
  } catch (error) {
    console.error('Error fetching active technicians:', error);
    throw error;
  }
};

// Work Order API Endpoints
// Create Work Order APi
export const createWorkOrder = async (workOrderData) => {
  try {
    const response = await API.post('/work-orders', workOrderData);
    return response.data;
  } catch (error) {
    console.error('Error creating work order:', error);
    throw error;
  }
};

// Fetch all work orders
export const fetchWorkOrders = async () => {
  try {
    const response = await API.get('/work-orders');
    const workOrders = response.data.map(order => ({
      ...order,
      createdAt: order.formattedCreatedAt,
      updatedAt: order.formattedUpdatedAt,
    }));
    return workOrders;
  } catch (error) {
    console.error('Error fetching work orders:', error);
    throw error;
  }
};

// Update the approval status of a work order
export const updateApprovalStatus = async (orderId, approvalStatus) => {
  try {
    const response = await API.patch(`/work-orders/${orderId}/approval-status`, {
      approvalStatus,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating approval status:', error);
    throw error;
  }
};

// Fetch Assets for Work Orders
export const fetchAssets = async () => {
  try {
    const response = await API.get('/assets');
    return response.data;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

// Update an existing work order
export const updateWorkOrder = async (orderId, updatedData) => {
  try {
    const response = await API.put(`/work-orders/${orderId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating work order:', error);
    throw error;
  }
};

// Delete an existing work order
export const deleteWorkOrder = async (orderId) => {
  try {
    const response = await API.delete(`/work-orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting work order:', error);
    throw error;
  }
};

// Mark as Completed 
export const markWorkOrderAsCompleted = async (orderId) => {
  try {
    const response = await API.put(`/work-orders/mark-as-completed/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error in markWorkOrderAsCompleted:', error);
    throw error;
  }
};

// Requests API Endpoints
// Create Request API
export const createRequest = async (requestData) => {
  try {
    const response = await API.post('/requests', requestData);
    return response.data;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

// Fetch all requests
export const fetchRequests = async () => {
  try {
    const response = await API.get('/requests');
    return response.data;   
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
};

// Update requests
export const updateRequest = async (id, requestData) => {
  try {
    const response = await API.put(`/requests/${id}`, requestData);
    return response.data;
  } catch (error) {
    console.error('Error updating request:', error);
    throw error;
  }
};

// Update Approval Status
export const updateRequestsApprovalStatus = async (id, newStatus) => {
  try {
    const response = await API.patch(`/requests/${id}/status`, { status: newStatus });
    return response.data;
  } catch (error) {
    console.error('Error updating approval status:', error);
    throw error;
  }
};


// Delete a request
export const deleteRequest = async (id) => {
  try {
    const response = await API.delete(`/requests/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting request:', error);
    throw error;
  }
};

// Converted to Work Order API
export const convertToWorkOrder = async (id) => {
  try {
    const response = await API.patch(`/requests/${id}/convert-to-work-order`);
    return response.data;
  } catch (error) {
    console.error('Error converting request to work order:', error);
    throw error;
  }
};

// Parts and Inventory API Endpoints
// Create Part API
export const createPart = async (partData) => {
  try {
    const response = await API.post('/parts', partData);
    return response.data;
  } catch (error) {
    console.error('Error creating part:', error);
    throw error.response?.data || error;
  }
};

// Fetch parts
export const getParts = async () => {
  try {
    const response = await API.get('/parts');
    return response.data;
  } catch (error) {
    console.error('Error fetching parts:', error);
    throw error.response?.data || error;
  }
};

// Adjust Parts Quantity
export const updatePartQuantity = async (partId, newQuantity) => {
  try {
    const response = await API.patch(`/parts/${partId}`, { availableQuantity: newQuantity });
    return response.data;
  } catch (error) {
    console.error("Error updating part quantity:", error);
    throw error.response?.data || error;
  }
};

// Delete Part API
export const deletePart = async (partId) => {
  try {
    const response = await API.delete(`/parts/${partId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting part:', error);
    throw error.response?.data || error;
  }
};

// Preventative Maintenance API Endpoints
// Create Preventive Maintenance
export const createPM = async (pmData) => {
  try {
    const response = await API.post('/preventive-maintenance', pmData);
    return response.data;
  } catch (error) {
    console.error('Error creating preventive maintenance:', error);
    throw error;
  }
};

// Fetch PMs
export const fetchAllPMs = async () => {
  try {
    const response = await API.get('/preventive-maintenance/getAll');
    return response.data;
  } catch (error) {
    console.error('Error fetching all PMs:', error);
    throw error;
  }
};

// View Preventive Maintenance by ID 
export const fetchPMById = async (pmId) => {
  try {
    const response = await API.get(`/preventive-maintenance/${pmId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Preventive Maintenance by ID:', error);
    throw error;
  }
};

// Update Preventive Maintenance
export const updatePM = async (pmId, pmData) => {
  try {
    const response = await API.put('/preventive-maintenance/update', { pmId, ...pmData });
    return response.data;
  } catch (error) {
    console.error('Error updating preventive maintenance:', error);
    throw error;
  }
};

// Delete Preventive Maintenance
export const deletePM = async (pmId) => {
  try {
    const response = await API.delete(`/preventive-maintenance/${pmId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting Preventive Maintenance:', error);
    throw error;
  }
};

export default API;