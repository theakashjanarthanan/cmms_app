// backend\controllers\teamController.js

const Team = require('../models/Team');

// Controller to create a team
const createTeam = async (req, res) => {
  const { name, description, workers } = req.body; // Destructure the team data from the request body

  try {
    // Create a new team and save it to the database
    const newTeam = new Team({
      name,
      description,
      workers, // Array of worker user IDs
    });

    await newTeam.save(); // Save the team

    res.status(201).json({
      message: 'Team created successfully',
      team: newTeam,
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
};

module.exports = { createTeam };

// Controller to fetch all teams
const getTeams = async (req, res) => {
  try {
    // Fetch all teams with populated worker information
    const teams = await Team.find()
      .populate('workers', 'fullName email') // Populate workers with their full name and email
      .sort({ createdAt: -1 }); // Sort by creation date in descending order

    // Transform teams data to include the number of workers
    const teamsWithWorkerCount = teams.map(team => ({
      ...team.toObject(),
      numberOfPeople: team.workers.length,
    }));

    res.status(200).json(teamsWithWorkerCount); // Send the teams data as a response
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

// Controller to update a team
const updateTeam = async (req, res) => {
  const { teamId, name, description, workers } = req.body;

  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      { name, description, workers, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.status(200).json({
      message: 'Team updated successfully',
      team: updatedTeam,
    });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: 'Failed to update team' });
  }
};

// Controller to delete a team
const deleteTeam = async (req, res) => {
  const { teamId } = req.body;

  try {
    // Find and delete the team
    const deletedTeam = await Team.findByIdAndDelete(teamId);

    if (!deletedTeam) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ error: 'Failed to delete team' });
  }
};

module.exports = { createTeam , getTeams , updateTeam , deleteTeam  };
