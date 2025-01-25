// frontend\src\components\PartsAndInventoryPage.jsx

import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";

import Sidebar from "../components/Sidebar"; // Import Sidebar
import Parts from "./Parts"; // Import Parts
import Inventory from "./Inventory"; // Import Inventory

const PartsAndInventoryPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false); // Sidebar minimized state
  const sidebarWidth = isSidebarMinimized ? 70 : 250; // Sidebar width changes based on minimized state

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Toggle Sidebar minimized/maximized state
  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Component */}
      <Sidebar isMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} />

      <Box
        sx={{
          flexGrow: 1,
          ml: `${sidebarWidth}px`, // Dynamically adjust margin-left based on sidebar width
          transition: "margin-left 0.3s ease", // Smooth transition for layout changes
          p: 3,
        }}
      >
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
