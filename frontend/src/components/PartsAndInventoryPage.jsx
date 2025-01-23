// frontend\src\components\PartsAndInventoryPage.jsx

import React, { useState } from "react";
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography 
} from "@mui/material";

import Sidebar from "./Sidebar";        // Import Sidebar
import Parts from "./Parts";            // Import Parts
import Inventory from "./Inventory";    // Import Inventory

const PartsAndInventoryPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Component */}
      <Sidebar />

      <Box sx={{ flexGrow: 1, ml: "250px", p: 3 }}>
        {/* Page Title */}
        <Typography variant="h4" gutterBottom>
          Parts and Inventory
        </Typography>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Parts" />
          <Tab label="Inventory" /> {/* New Inventory tab */}
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && <Parts />}
          {activeTab === 1 && <Inventory />} {/* Render Inventory component */}
        </Box>
      </Box>
    </Box>
  );
};

export default PartsAndInventoryPage;
