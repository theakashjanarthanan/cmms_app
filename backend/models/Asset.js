// backend/models/Asset.js

const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    assetID: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    displayName: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Operational', 'Out of Service'], default: 'Operational' },
    model: { type: String, required: true },
    manufacturer: { type: String },
    serialNumber: { type: String },
    department: { type: String },
    warrantyStatus: { type: String, enum: ['Warranty', 'Out of Warranty'], default: 'Warranty' },
    warrantyExpirationDate: { type: Date },
    deletedAt: { type: Date }, // New field for deletedAt
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

