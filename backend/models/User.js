// backend\models\User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Requestor', 'Technician', 'Guest',], default: 'Guest' },
    dateCreated: { type: Date, default: Date.now },   
    lastLogin: { type: Date, default: null }        // Initialize the lastLogin as null
});

module.exports = mongoose.model('User', UserSchema);
