import API from '../api/api';

// Asset Management API Endpoints

// Create Asset
export const createAsset = async (assetData) => {
  try {
    const response = await API.post('/asset-management', assetData);
    return response.data;
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
};

// Fetch Assets
export const fetchAssets = async () => {
  try {
    const response = await API.get('/asset-management');
    return response.data;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

// Update Asset
export const updateAsset = async (assetId, updatedData) => {
  try {
    const response = await API.put(`/asset-management/${assetId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
};

// Delete Asset
export const deleteAsset = async (assetId) => {
  try {
    const response = await API.delete(`/asset-management/${assetId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting asset:', error);
    throw error;
  }
};
