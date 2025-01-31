import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header/header";
import AssetDialog from "../components/AssetManagement/AssetDialog";
import AssetTable from "../components/AssetManagement/AssetTable";
import AssetOptions from "../components/AssetManagement/AssetOptions";
import AssetFilters from "../components/AssetManagement/AssetFilters";

import {
  fetchAssets,
  createAsset,
} from "../api/assetapi";

const AssetManagement = () => {
  const navigate = useNavigate();
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: null,
    status: "Operational",
    model: null,
    manufacturer: null,
    category: "None",
    serialNumber: null,
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });

  const [assets, setAssets] = useState([]);
  const [editingAsset, setEditingAsset] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [setSelectedAssets] = useState([]);

  const [selectedColumns, setSelectedColumns] = useState([
    "name",
    "description",
    "status",
    "model",
    "manufacturer",
    "category",
    "serialNumber",
  ]);

  const sidebarWidth = isSidebarMinimized ? 5 : 260;

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const data = await fetchAssets();
        setAssets(data);
        setFilteredOrders(data);
        console.log("Assets Fetched Successfully");
      } catch (error) {
        console.error("Error fetching assets:", error);
        setSnackbar({
          open: true,
          message: "Error fetching assets.",
          type: "error",
        });
      }
    };

    loadAssets();
  }, []);

  useEffect(() => {
    let filtered = assets;

    if (selectedStatus) {
      filtered = filtered.filter((asset) => asset.status === selectedStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter((asset) =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [selectedStatus, searchTerm, assets]);

  const handleDialogOpen = (asset = null) => {
    if (asset) {
      setFormData(asset);
      setEditingAsset(asset._id);
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    resetForm();
    setOpenDialog(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: null,
      status: "Operational",
      model: null,
      manufacturer: null,
      category: "None",
      serialNumber: null,
    });
    setEditingAsset(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Handle asset creation
      const data = await createAsset(formData);
      setAssets((prevAssets) => [...prevAssets, data]);  
      setSnackbar({
        open: true,
        message: "Asset created successfully!",
        type: "success",
      });
      handleDialogClose();  
      console.log("Asset Created Successfully")
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to create asset. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false); 
    }
  };  

  const toggleSidebar = () => {
    setIsSidebarMinimized((prev) => !prev);
  };

  const handleColumnClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColumnSelect = (column) => {
    setSelectedColumns((prev) => {
      if (prev.includes(column)) {
        return prev.filter((col) => col !== column);
      } else {
        return [...prev, column];
      }
    });
  };

  const handleColumnClose = () => {
    setAnchorEl(null);
  };

  const handleViewPage = (asset) => {
    navigate(`/assets/view/${asset._id}`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar isMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} />
      <Box
        sx={{
          flexGrow: 1,
          ml: `${sidebarWidth}px`,
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Header Component */}
        <Header
          title="Assets"
          toggleDrawer={toggleSidebar}
          buttonText="Create Asset"
          buttonAction={() => handleDialogOpen()}
          sx={
            { padding: "0" }
          }
        />

        {/* AssetFilter component */}
        <AssetOptions
          filteredOrders={filteredOrders}
          assets={assets}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleColumnClick={handleColumnClick}
          handleColumnClose={handleColumnClose}
          anchorEl={anchorEl}
          handleColumnSelect={handleColumnSelect}
          selectedColumns={selectedColumns}
        />

        {/* Divider Line */}
        <div className="h-px bg-gray-300"></div>

        {/* AssetFilter component */}
        <Box sx={{ padding: "20px" }} ><AssetFilters
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        /></Box>

        {/* Asset Table Component */}
        <AssetTable
          assets={filteredOrders}
          selectedColumns={selectedColumns}
          onView={handleViewPage}
          selectedAssets={setSelectedAssets}
          setSelectedAssets={setSelectedAssets}
          setAssets={setAssets}

        />

        {/* Asset Creation / Updation Component */}
        <AssetDialog
          open={openDialog}
          onClose={handleDialogClose}
          onSubmit={handleSubmit}
          editingAsset={editingAsset}
          loading={loading}
          formData={formData}
          handleChange={handleChange}
        />
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.type}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssetManagement;
