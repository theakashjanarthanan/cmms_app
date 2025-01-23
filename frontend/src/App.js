// frontend\src\App.js

import React, { useContext } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AuthContext from './context/AuthContext';

import Login from './components/Login';                                          // Login Page
import Register from './components/Register';                                    // Register Page
import Dashboard from './components/Dashboard';                                  // Dashbboard Page
import UserManagement from './components/UserManagement';                        // User Management Page
import AssetManagement from "./components/AssetManagement";                      // Asset Management Page
import PeoplesAndTeamPage from './components/PeoplesAndTeamPage';                // Peoples and Team Page
import TechnicianPortalPage from './components/TechnicianPortalPage';            // Technician Portal
import PreventiveMaintenancePage from './components/PreventiveMaintenancePage';  // Preventive Maintenance Page
import WorkOrdersManagementPage from './components/WorkOrdersManagementPage';    // Work Orders Management Page
import PartsAndInventoryPage from './components/PartsAndInventoryPage';          // Parts and Inventory Page
import Requests from './components/Requests';                                    // Requests Management Page
import PurchaseOrderPage from './components/PurchaseOrderPage';                  // Purchase Order Portal

 
const App = () => {
    const { auth, user } = useContext(AuthContext);

    return (
        <Router>
            <Routes>

                {/* Login Route */}
                <Route path="/login" element={auth ? <Navigate to="/dashboard" /> : <Login />} />

                {/* Register Route */}
                <Route path="/register" element={auth ? <Navigate to="/dashboard" /> : <Register />} />

                {/* Dashboard Route */}
                <Route path="/dashboard" element={auth ? <Dashboard /> : <Navigate to="/login" />} />

                {/* Asset Management Route */}
                <Route
                path="/asset-management"
                element={auth ? <AssetManagement /> : <Navigate to="/asset-management" />}
                />

                {/* Preventive Maintenance Route */}
                <Route
                    path="/preventive-maintenance"
                    element={auth ? <PreventiveMaintenancePage /> : <Navigate to="/preventive-maintenance" />}
                />

                {/* Work Orders Management Route */}
                <Route
                    path="/work-orders-management"
                    element={auth ? <WorkOrdersManagementPage /> : <Navigate to="/work-orders-management" />}
                />
                
                {/* Peoples and Team Route */}
                <Route
                    path="/peoples-and-team"
                    element={auth ? <PeoplesAndTeamPage /> : <Navigate to="/peoples-and-team" />}
                />

                {/* Technician Portal Route */}
                  <Route 
                  path="/technician-portal" 
                  element={auth ? <TechnicianPortalPage /> : <Navigate to="/technician-portal" />} />

                {/* Purchase Order Route */}
                  <Route 
                  path="/purchase-order" 
                  element={auth ? <PurchaseOrderPage /> : <Navigate to="/purchase-order" />} />

                {/* Protect User Management route: Only accessible by Admin users */}
                <Route
                    path="/user-management"
                    element={auth && user?.role === 'Admin' ? <UserManagement /> : <Navigate to="/user-management" />}
                />


                {/* User Management Route  */}
                <Route path="/user-management" element={<UserManagement />} />


                {/* Request Management Route */}
                <Route path="/requests" element={<Requests />} />


                 {/* Parts and Inventory Route */}
                <Route
                path="/parts-and-inventory"
                element={auth ? <PartsAndInventoryPage /> : <Navigate to="/parts-and-inventory" />}
                />

            </Routes>
        </Router>
    );
};

export default App;
