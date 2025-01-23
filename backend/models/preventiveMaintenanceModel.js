// models/preventiveMaintenanceModel.js

const mongoose = require('mongoose');

const preventiveMaintenanceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    displayName: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    priority: { type: String, required: true, enum: ['Low', 'Medium', 'High'] },
    location: { type: String, required: true },
    category: { type: String, default: 'Preventative' },
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',  
      required: true,  
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  
      required: true,  
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team', 
      required: true, 
    },
    status: {
      type: String,
      enum: ['Open', 'On Hold', 'Pending', 'Completed', 'Converted as Work Order'],
      default: 'Open', 
    },
    dateCreated: { type: Date, default: Date.now },
    dateUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PreventiveMaintenance', preventiveMaintenanceSchema);
