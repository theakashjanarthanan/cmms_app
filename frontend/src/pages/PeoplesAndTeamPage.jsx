// frontend/src/components/PeoplesAndTeamPage.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
} from "@mui/material";

import Sidebar from "../components/Sidebar";
import { fetchUsers } from "../api/api"; // Import API
import Teams from "../components/PeoplesandTeams/Teams"; // Import the TeamsPage Component
import Peoples from "../components/PeoplesandTeams/Peoples"; // Import the UserManagement Component
 

const PeoplesAndTeamPage = () => {
  const [setUsers] = useState([]);

  // Sidebar States
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false); // Sidebar minimized state
  const sidebarWidth = isSidebarMinimized ? 70 : 250; // Sidebar width based on minimized state

  // Pagination States
  const [selectedTab, setSelectedTab] = useState(0); // State to manage selected tab

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await fetchUsers();
        // Sort users by MongoDB _id (newest first)
        const sortedUsers = usersData.sort((a, b) =>
          b._id.localeCompare(a._id),
        );
        setUsers(sortedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    getUsers();
  }, [setUsers  ]);


  // Handle tab change
  const handleTabChange = (event, newTab) => setSelectedTab(newTab);

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
        {/* Tabs for Peoples and Teams */}
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="Peoples and Teams tabs"
        >
          <Tab label="Peoples" />
          <Tab label="Teams" />
        </Tabs>

        {/* Display Content Based on Selected Tab */}
        {selectedTab === 0 ? (
          <div>
            <Peoples/>
          </div>
        ) : (
          // Render TeamsPage Component when Teams tab is selected
          <Teams />
        )}
      </Box>
    </Box>
  );
};

export default PeoplesAndTeamPage;
