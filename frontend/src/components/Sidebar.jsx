import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaClipboardList, FaUsers } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";
import AuthContext from "../context/AuthContext";
import "../styles/sidebar.css";

const Sidebar = ({ isMinimized }) => {
    const [isProfileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const toggleProfileDropdown = () => {
        setProfileOpen((prev) => !prev);
    };

    const handleLogout = () => {
        logout();
    };

    const isActive = (path) => location.pathname === path ? "active-sidebar-link" : "";

    return (
        <div className={`sidebar ${isMinimized ? "minimized" : ""}`}>
            <div className="sidebar-header">
                <div className="header-left">
                    <img src="/Images/settings.ico" alt="Settings" className="settings-icon" />
                    <h2>UpKeep</h2>
                </div>
                <div className="header-right">
                    <img src="/Images/bell.ico" alt="Notification" className="notification-icon" style={{ width: "20px", height: "20px" }} />
                    <Avatar
                        sx={{
                            width: 23,
                            height: 23,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "3px", // Add padding around the letter
                            fontSize: "15px"  // Optional: Adjust font size if necessary
                        }}
                        className="profile-icon"
                        onClick={toggleProfileDropdown}
                    >
                        {user?.fullName ? user.fullName[0] : ""}  {/* Display first letter of full name */}
                    </Avatar>

                    <div className={`profile-dropdown ${isProfileOpen ? "open" : ""}`}>
                        <ul>
                            {/* Always Visible Full Name */}
                            <li className="profile-info always-visible">
                                <div className="profile-info-container">
                                    <Avatar
                                        sx={{
                                            width: 23,
                                            height: 23,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            padding: "3px",
                                            fontSize: "15px"
                                        }}
                                        className="profile-icon-drop"
                                        onClick={toggleProfileDropdown}
                                    >
                                        {user?.fullName ? user.fullName[0] : ""}  {/* Display first letter of full name */}
                                    </Avatar>
                                    <span className="profile-name">{user?.fullName || "User"}</span>
                                </div>
                            </li>
                            <hr className="profile-divider" />

                            {/* These items appear when dropdown is open */}
                            {isProfileOpen && (
                                <>
                                    <li><Link to="/profile">Profile</Link></li>
                                    <li><Link to="/settings">Settings</Link></li>
                                    <li>
                                        <Link to="/login" onClick={handleLogout} className="logout-link">
                                            Logout
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                </div>
            </div>

            <hr className="sidebar-divider" />

            <ul>
                <Link to="/dashboard" className={`sidebar-link ${isActive("/dashboard")}`}>
                    <li>
                        <div className="icon-analytics" style={{ marginRight: "8px" }}>
                            <svg width="21" height="21" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white" strokeWidth="0">
                                <g clipPath="url(#clip0_1623_106)">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M2 13a1 1 0 011-1h4a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1v-8zm2 1v6h2v-6H4zM16 8a1 1 0 011-1h4a1 1 0 011 1v13a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm2 1v11h2V9h-2zM9 3a1 1 0 011-1h4a1 1 0 011 1v18a1 1 0 01-1 1h-4a1 1 0 01-1-1V3zm2 1v16h2V4h-2z"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1623_106">
                                        <path fill="#fff" transform="translate(2 2)" d="M0 0h20v20H0z"></path>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <span>Dashboard</span>
                    </li>
                </Link>

                <Link to="/work-orders-management" className={`sidebar-link ${isActive("/work-orders-management")}`}>
                    <li><FaClipboardList className="module-icon" /><span>Work Orders</span></li>
                </Link>

                <Link to="/asset-management" className={`sidebar-link ${isActive("/asset-management")}`}>
                    <li>
                        <div className="icon-asset">
                            <svg width="21" height="21" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth="0" style={{ marginRight: "8px" }}>
                                <g clipPath="url(#clip0_238_18)">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M10.54 2.353C10.99 2.12 11.494 2 12 2s1.01.12 1.46.353h.001l7 3.602c.45.233.837.577 1.112 1.005.276.43.426.925.427 1.438v7.204c0 .512-.151 1.009-.427 1.438a2.913 2.913 0 01-1.112 1.005l-.004.002-6.996 3.6h-.002a3.171 3.171 0 01-1.513.353 3.171 3.171 0 01-1.405-.353h-.002l-6.996-3.6-.004-.002a2.913 2.913 0 01-1.112-1.005A2.665 2.665 0 012 15.602V8.398c0-.513.151-1.009.427-1.438a2.913 2.913 0 011.112-1.005l.004-.002 6.998-3.6zM13 19.635l6.54-3.364.001-.001a.914.914 0 00.35-.31.665.665 0 00.11-.36V8.9l-7.001 3.676v7.059zm-2-7.059v7.058L4.46 16.27l-.001-.001a.914.914 0 01-.35-.31.665.665 0 01-.11-.36V8.9l6.999 3.676zM12 4c-.195 0-.38.046-.539.129l-.004.001-6.183 3.181L12 10.842l6.726-3.531-6.186-3.182A1.173 1.173 0 0012 4z"
                                        fill="white"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_238_18">
                                        <path fill="#fff" transform="translate(2 2)" d="M0 0h20v20.001H0z"></path>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <span>Assets</span>
                    </li>
                </Link>

                <Link to="/peoples-and-team" className={`sidebar-link ${isActive("/peoples-and-team")}`}>
                    <li><FaUsers className="module-icon" /><span>Peoples & Teams</span></li>
                </Link>
            </ul>
        </div>
    );
};

export default Sidebar;
