// backend\index.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');  

const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
const peoplesRoutes = require('./routes/peoplesRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes');
const requestRoutes = require('./routes/requestRoutes');
const teamRoutes = require('./routes/teamRoutes');
const partsRoutes = require('./routes/parts');
const preventiveMaintenanceRoutes = require('./routes/preventiveMaintenanceRoutes');  
 
dotenv.config();
const app = express();

// Middleware CORS - Enable CORS for all origins (you can also restrict it to specific origins)
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.log(error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/peoples', peoplesRoutes);
app.use('/api/technician-portal', technicianRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/requests', requestRoutes); 
app.use('/api/teams', teamRoutes);
app.use('/api/parts', partsRoutes);
app.use('/api/preventive-maintenance', preventiveMaintenanceRoutes);
 
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
