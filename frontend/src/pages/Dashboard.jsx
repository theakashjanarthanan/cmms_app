// frontend\src\pages\Dashboard.jsx

import React, { useContext, useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Avatar
} from "@mui/material";

import AuthContext from "../context/AuthContext";              // Context

import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";                   // Import Sidebar component
import styles from "../styles/dashboard.module.css";           // Import the CSS module

const Dashboard = () => {
  const navigate = useNavigate();

  // States
  const { user, auth, logout } = useContext(AuthContext);              // Get user data and logout from context
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false); // Track sidebar state

  useEffect(() => {

    // If user is not authenticated, redirect to login page
    if (!auth) {
      navigate("/login");
    }
  }, [auth, navigate]);

  // Handles Logging Out
    const handleLogout = () => {
      logout();
      navigate("/login"); // Redirect to login page after logout
    };

  // Toggle sidebar minimized/maximized state
    const toggleSidebar = () => {
      setIsSidebarMinimized(!isSidebarMinimized);
    };

  return (
    <Box className={styles.dashboardContainer}>
      
      <Sidebar
        onLogout={handleLogout}
        userRole={user?.role}
        isMinimized={isSidebarMinimized}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content Area */}
      <Box
            className={styles.dashboardMainContent}
            sx={{
            marginLeft: isSidebarMinimized ? "60px" : "250px",  
            transition: "margin-left 0.3s ease",  
            }}
        >

            <>
                {/* Avatar */}
                <Box className={styles.dashboardMainContent}>
                    <Typography variant="h4" className={styles.dashboardWelcome}>
                    Welcome, {user?.fullName}
                    </Typography>

                    <Typography variant="h6" className={styles.dashboardRole}>
                    Role: {user?.role}
                    </Typography>
                </Box>
            </>

            <>
                {/* User Info Box */}
                <Box className={styles.userInfoBox}>
                    <Avatar
                        alt={user?.fullName}
                        src="/path-to-avatar.jpg"
                        className={styles.userAvatar}
                    />
                    <Typography variant="h6" className={styles.userName}>
                        {user?.fullName}
                    </Typography>
                    <Typography variant="body2" className={styles.userRole}>
                        {user?.role}
                    </Typography>
                </Box>
            </>
            
        </Box>
    </Box>
  );
};

export default Dashboard;
