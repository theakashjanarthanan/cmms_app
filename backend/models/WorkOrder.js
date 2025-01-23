// backend/models/WorkOrder.js

const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema(
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
    orderStatus:{
      type: String,
      enum: ["Open", "In Progress", "On Hold",  "Completed"],
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

// Add a method to format timestamps
workOrderSchema.methods.toFormattedJSON = function () {
  return {
    ...this.toObject(),
    formattedCreatedAt: this.createdAt
      ? this.createdAt.toLocaleString("en-US", {
          hour12: true,
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null,
    formattedUpdatedAt: this.updatedAt
      ? this.updatedAt.toLocaleString("en-US", {
          hour12: true,
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null,
  };
};

workOrderSchema.virtual('formattedStartDate').get(function () {
  return this.startDate
    ? new Date(this.startDate).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;
});

workOrderSchema.virtual('formattedDueDate').get(function () {
  return this.dueDate
    ? new Date(this.dueDate).toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;
});

workOrderSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model("WorkOrder", workOrderSchema);
