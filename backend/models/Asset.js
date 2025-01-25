// backend/models/Asset.js

const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    assetID: { type: String, unique: true },
    name: { type: String, required: true }, 
    description: { type: String },
    status: { type: String, enum: ['Operational', 'Out of Service'], default: 'Operational' },
    model: { type: String },
    manufacturer: { type: String },
    category: { type: String, enum: ['None', 'Damage', 'Electrical', 'Inspection', 'Meter', 'Preventative', 'Project', 'Safety'], default: 'None' },
    serialNumber: { type: String },
  },
  { timestamps: true }
);

// Helper function for formatting dates to 12-hour format
function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Virtual field for formatted `createdAt`
assetSchema.virtual('formattedCreatedAt').get(function () {
  return formatDate(this.createdAt);
});

// Virtual field for formatted `deletedAt`
assetSchema.virtual('formattedDeletedAt').get(function () {
  return formatDate(this.deletedAt);
});

module.exports = mongoose.model('Asset', assetSchema);

