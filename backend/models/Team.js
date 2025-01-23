// backend\models\Team.js

const mongoose = require('mongoose');

// Define the Team Schema
const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    workers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs
    createdAt: { type: Date, default: Date.now }, // Creation date
    updatedAt: { type: Date, default: Date.now }, // Update date
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, // Automatically manage createdAt and updatedAt
  }
);

// Create the Team model
const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;
