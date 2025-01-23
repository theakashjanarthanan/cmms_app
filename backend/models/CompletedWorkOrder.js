// backend/models/CompletedWorkOrder.js

const mongoose = require('mongoose');

const completedWorkOrderSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    displayName: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    dueDate: { type: Date },
    priority: { type: String },
    category: { type: String },
    location: { type: String },
    approvalStatus: {
      type: String,
      enum: ["Approved", "Pending", "On Hold"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Open", "In Progress", "On Hold", "Completed"],
      default: "Open"
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",  
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CompletedWorkOrder", completedWorkOrderSchema);
