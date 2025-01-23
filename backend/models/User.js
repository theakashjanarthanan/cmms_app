// backend\models\User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Inventory Manager', 'Technician', 'Manager', 'Guest' , 'Requestor'], default: 'Guest' }
});

module.exports = mongoose.model('User', UserSchema);
