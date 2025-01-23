// backend\models\Part.js

const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  name: { type: String, required: true },
  partNumber: { type: String, required: true },
  description: { type: String },
  assignedWorker: { type: String },
  assignedTeams: { type: [String] },
  type: { type: String, enum: ['critical', 'non-stock'], required: true },
  location: { type: String },
  additionalInfo: { type: String },
  cost: { type: Number, default: 0 },
  availableQuantity: { type: Number, default: 0 },
  maxQuantity: { type: Number },
  minQuantity: { type: Number },
}, { timestamps: true });

// Virtual field for status calculation
partSchema.virtual('status').get(function () {
  if (this.availableQuantity === 0) return 'Out of Stock';
  if (this.availableQuantity < this.minQuantity) return 'Low Stock';
  if (this.availableQuantity > this.maxQuantity) return 'In Stock';
  return 'In Stock'; // Default status if none of the above conditions are met
});

// Ensure virtuals are included in the result of toObject and toJSON
partSchema.set('toObject', { virtuals: true });
partSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Part', partSchema);
