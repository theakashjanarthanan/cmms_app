// frontend\src\App.js

import React, { useContext } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AuthContext from './context/AuthContext';

import Login from './pages/Login';                                          // Login Page
import Register from './pages/Register';                                    // Register Page
import Dashboard from './pages/Dashboard';                                  // Dashbboard Page
import AssetManagement from "./pages/AssetManagement";                      // Asset Management Page
import PeoplesAndTeamPage from './pages/PeoplesAndTeamPage';                // Peoples and Team Page
import TechnicianPortalPage from './pages/TechnicianPortalPage';            // Technician Portal
import PreventiveMaintenancePage from './pages/PreventiveMaintenancePage';  // Preventive Maintenance Page
import WorkOrdersManagementPage from './pages/WorkOrdersManagementPage';    // Work Orders Management Page
import PartsAndInventoryPage from './pages/PartsAndInventoryPage';          // Parts and Inventory Page
import Requests from './pages/Requests';                                    // Requests Management Page
import PurchaseOrderPage from './pages/PurchaseOrderPage';                  // Purchase Order Portal

const App = () => {
    const { auth } = useContext(AuthContext);

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
