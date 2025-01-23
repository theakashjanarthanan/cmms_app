// backend\routes\teamRoutes.js

const express = require('express');
const { createTeam , getTeams , updateTeam , deleteTeam } = require('../controllers/teamController');
const router = express.Router();

// Route to create a new team
router.post('/create', createTeam);

// Route to get all teams
router.get('/', getTeams);

// Route to update a team
router.put('/update', updateTeam);

// Route to delete a team
router.delete('/delete', deleteTeam);

module.exports = router;
