// frontend/src/components/Sidebar.jsx

import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';      // Icon for Dashboard Page
// 
// import BusinessIcon from "@mui/icons-material/Business";        // Icon for Asset Management Page 
import SettingsIcon from '@mui/icons-material/Settings';        // Icon for Preventive Maintenance Page
import WorkIcon from '@mui/icons-material/Work';                // Icon for Work Orders Management Page
import GroupIcon from '@mui/icons-material/Group';              // Icon for Peoples and Team Page
import BuildIcon from '@mui/icons-material/Build';              // Icon for Technician Portal
import RequestPageIcon from '@mui/icons-material/RequestPage';  // Icon for Requests Page
import InventoryIcon from '@mui/icons-material/Inventory';      // Icon for Inventory Page
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
                        <ListItemIcon className="sidebar-icon">   <DashboardIcon sx={{ color: '#ffffff' }} /></ListItemIcon>
                        <ListItemText primary="Dashboard" className="sidebar-text" />
                    </ListItem>

                {/* Asset Management Page */}
                    <ListItem button component={Link} to="/asset-management" className="sidebar-item">
                        <ListItemIcon className="sidebar-icon">
                            {/* Custom SVG for Asset Management with white color */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" margin="0" strokeWidth="0">
                                <g clipPath="url(#clip0_238_18)">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.54 2.353C10.99 2.12 11.494 2 12 2s1.01.12 1.46.353h.001l7 3.602c.45.233.837.577 1.112 1.005.276.43.426.925.427 1.438v7.204c0 .512-.151 1.009-.427 1.438a2.913 2.913 0 01-1.112 1.005l-.004.002-6.996 3.6h-.002a3.171 3.171 0 01-1.513.353 3.171 3.171 0 01-1.405-.353h-.002l-6.996-3.6-.004-.002a2.913 2.913 0 01-1.112-1.005A2.665 2.665 0 012 15.602V8.398c0-.513.151-1.009.427-1.438a2.913 2.913 0 011.112-1.005l.004-.002 6.998-3.6zM13 19.635l6.54-3.364.001-.001a.914.914 0 00.35-.31.665.665 0 00.11-.36V8.9l-7.001 3.676v7.059zm-2-7.059v7.058L4.46 16.27l-.001-.001a.914.914 0 01-.35-.31.665.665 0 01-.11-.36V8.9l6.999 3.676zM12 4c-.195 0-.38.046-.539.129l-.004.001-6.183 3.181L12 10.842l6.726-3.531-6.186-3.182A1.173 1.173 0 0012 4z" fill="#ffffff"></path>
                                </g>
                                <defs>
                                    <clipPath id="clip0_238_18">
                                        <path fill="#fff" transform="translate(2 2)" d="M0 0h20v20.001H0z"></path>
                                    </clipPath>
                                </defs>
                            </svg> 
                        </ListItemIcon>
                        <ListItemText primary="Assets" className="sidebar-text" />
                    </ListItem>

                {/* Preventative Maintenance Page */}
                    <ListItem button component={Link} to="/preventive-maintenance" className="sidebar-item">
                        <ListItemIcon className="sidebar-icon"> <SettingsIcon /> </ListItemIcon>
                        <ListItemText primary="Preventive Maintenance" className="sidebar-text" />
                    </ListItem>

                {/* Work Order Management Page */}
                    <ListItem button component={Link} to="/work-orders-management" className="sidebar-item">
                        <ListItemIcon className="sidebar-icon"> <WorkIcon /> </ListItemIcon>
                        <ListItemText primary="Work Orders Management" className="sidebar-text" />
                    </ListItem>
  
                {/* Parts and Inventory Page */}
                    <ListItem button component={Link} to="/parts-and-inventory" className="sidebar-item">
                        <ListItemIcon className="sidebar-icon"> <InventoryIcon /> </ListItemIcon>
                        <ListItemText primary="Parts and Inventory" className="sidebar-text" />
                    </ListItem>

                 {/* Peoples and Teams Page */}             
                    <ListItem button component={Link} to="/peoples-and-team" className="sidebar-item">
                        <ListItemIcon className="sidebar-icon"> <GroupIcon /> </ListItemIcon>
                        <ListItemText primary="Peoples and Team" className="sidebar-text" />
                    </ListItem>

               
                 {/* Technician Portal Page */}  
                    <ListItem button component={Link} to="/technician-portal" className="sidebar-item">
                        <ListItemIcon className="sidebar-icon"> <BuildIcon /> </ListItemIcon>
                        <ListItemText primary="Technician Portal" className="sidebar-text" />
                    </ListItem>
            
                 {/* Requests Page */}
                    <ListItem button component={Link} to="/requests" className="sidebar-item">
                        <ListItemIcon className="sidebar-icon"> <RequestPageIcon /> </ListItemIcon>
                        <ListItemText primary="Requests" className="sidebar-text" />
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
