import API from '../api/api';

// Peoples and Team API Endpoints

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

//  Fetch Users for Creating Teams
export const fetchUsers = async () => {
  try {
    const response = await API.get('/peoples');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

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


