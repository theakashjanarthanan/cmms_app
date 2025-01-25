// frontend/src/components/PurchaseOrder.jsx

import React from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from "../components/Sidebar";

const PurchaseOrderPage = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, ml: '250px', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Purchase Order Page
        </Typography>
        <Typography variant="body1">
          This is the Purchase Order Page 
        </Typography>
      </Box>
    </Box>
  );
};

export default PurchaseOrderPage;
