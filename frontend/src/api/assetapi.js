import API from '../api/api';

// Asset Management API Endpoints

// Create Asset
export const createAsset = async (assetData) => {
  try {
    const response = await API.post('/assets', assetData);
    return response.data;
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
};

// Fetch Assets
export const fetchAssets = async () => {
  try {
    const response = await API.get('/assets');
    return response.data;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

// Fetch Single Asset
export const fetchSingleAsset = async (id) => {
  try {
    const response = await API.get(`/assets/${id}`); // Fetch the asset by its ID
    return response.data; // Return the asset data
  } catch (error) {
    console.error('Error fetching asset:', error);
    throw error;
  }
};

// Update Asset
export const updateAsset = async (id, updatedData) => {
  try {
    const response = await API.put(`/assets/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
};

// Delete Asset
export const deleteAsset = async (id) => {
  try {
    const response = await API.delete(`/assets/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting asset:', error);
    throw error;
  }
};

 