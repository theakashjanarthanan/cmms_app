// frontend/src/components/Sidebar.jsx

import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';      // Icon for Dashboard Page
import BusinessIcon from "@mui/icons-material/Business";        // Icon for Asset Management Page 
// import SettingsIcon from '@mui/icons-material/Settings';        // Icon for Preventive Maintenance Page
// import WorkIcon from '@mui/icons-material/Work';                // Icon for Work Orders Management Page
// import PeopleIcon from '@mui/icons-material/People';            // Icon for User Management Page
// import GroupIcon from '@mui/icons-material/Group';              // Icon for Peoples and Team Page
// import BuildIcon from '@mui/icons-material/Build';              // Icon for Technician Portal
// import RequestPageIcon from '@mui/icons-material/RequestPage';  // Icon for Requests Page
// import InventoryIcon from '@mui/icons-material/Inventory';      // Icon for Inventory Page
import LogoutIcon from '@mui/icons-material/Logout';            // Icon for Logout Button
// import MenuIcon from '@mui/icons-material/Menu';                // Icon for Minimize/Maximize Toggle

import { Link } from 'react-router-dom';   

import '../styles/sidebar.css';                                 // CSS File

const Sidebar = ({ onLogout, userRole, isMinimized, toggleSidebar }) => {
    return (
        <Box className={`sidebar-container ${isMinimized ? 'minimized' : ''}`}>
            {/* Sidebar Header */}
            <div className="sidebar-header">
                <span>{!isMinimized && 'Upkeep'}</span>
                <button className="minimize-button" onClick={toggleSidebar}>
                    {/* <MenuIcon /> */}
                </button>
            </div>

            {/* Sidebar List */}
            <List className="sidebar-list">
                {/* Dashboard Page */}
                <ListItem button component={Link} to="/dashboard" className="sidebar-item">
                    <ListItemIcon className="sidebar-icon"> <DashboardIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" className="sidebar-text" />
                </ListItem>

                {/* Asset Management Page */}
                <ListItem button component={Link} to="/asset-management" className="sidebar-item">
                    <ListItemIcon className="sidebar-icon"> <BusinessIcon /> </ListItemIcon>
                    <ListItemText primary="Asset Management" className="sidebar-text" />
                </ListItem>

 
            </List>

            {/* Logout */}
            <ListItem button onClick={onLogout} className="logout">
                <ListItemIcon className="sidebar-icon"> <LogoutIcon /> </ListItemIcon>
                <ListItemText primary="Logout" className="sidebar-text" />
            </ListItem>
        </Box>
    );
};

export default Sidebar;
