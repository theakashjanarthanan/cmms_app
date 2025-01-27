import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from "@mui/material";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header/header";
import AssetDialog from "../components/AssetManagementDialogs/AssetDialog";
import AssetTable from "../components/AssetManagementDialogs/AssetTable";  
import ViewAssetDialog from "../components/AssetManagementDialogs/ViewAssetDialog"
import AssetOptions from "../components/AssetManagementDialogs/AssetOptions"; 
import AssetFilters from "../components/AssetManagementDialogs/AssetFilters";

import {
  fetchAssets,
  createAsset,
  updateAsset,
  deleteAsset,
  fetchSingleAsset,
} from "../api/assetapi";

const AssetManagement = () => {
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
  const [viewDialog, setViewDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
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

  const handleViewDialogClose = () => {
    setViewDialog(false);
  };

  const handleDeleteDialogOpen = (assetId) => {
    setAssetToDelete(assetId);
    setDeleteDialog(true);
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
      if (editingAsset) {
        await updateAsset(editingAsset, formData);
        setAssets((prevAssets) =>
          prevAssets.map((asset) =>
            asset._id === editingAsset ? { ...asset, ...formData } : asset
          )
        );
        setSnackbar({
          open: true,
          message: "Asset updated successfully!",
          type: "success",
        });
      } else {
        const data = await createAsset(formData);
        setAssets((prevAssets) => [...prevAssets, data]);
        setSnackbar({
          open: true,
          message: "Asset created successfully!",
          type: "success",
        });
      }
      handleDialogClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to save asset. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

    const handleViewDialogOpen = async (asset) => {
      try {
        const fetchedAsset = await fetchSingleAsset(asset._id);
        setFormData(fetchedAsset);
        setViewDialog(true);
      } catch (error) {
        console.error("Error fetching asset details:", error);
        setSnackbar({
          open: true,
          message: "Error fetching asset details.",
          type: "error",
        });
      }
    };

  const handleDelete = async () => {
    if (!assetToDelete) return;

    try {
      await deleteAsset(assetToDelete);
      setAssets((prevAssets) =>
        prevAssets.filter((asset) => asset._id !== assetToDelete)
      );
      setSnackbar({
        open: true,
        message: "Asset deleted successfully!",
        type: "success",
      });
      handleDeleteDialogClose();
    } catch (error) {
      console.error("Error deleting asset:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete asset.",
        type: "error",
      });
    }
  };

  const handleDeleteDialogClose = () => {
    setAssetToDelete(null);
    setDeleteDialog(false);
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

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar isMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} />
      <Box
        sx={{
          flexGrow: 1,
          ml: `${sidebarWidth}px`,
          transition: "margin-left 0.3s ease",
          p: 3,
        }}
      > 
        {/* Header Component */}
        <Header
          title="Assets"
          toggleDrawer={toggleSidebar}
          buttonText="Create Asset"
          buttonAction={() => handleDialogOpen()}
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

         {/* AssetFilter component */}
         <AssetFilters
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}  
        />

        {/* Asset Table Component */}
        <AssetTable
          assets={filteredOrders}
          selectedColumns={selectedColumns}
          onView={handleViewDialogOpen}
        />

        {/* View Asset Dialog Component */}
        <ViewAssetDialog
          viewDialog={viewDialog}
          handleViewDialogClose={handleViewDialogClose}
          formData={formData}
          onEdit={handleDialogOpen}
          onDelete={handleDeleteDialogOpen}
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
      
      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={handleDeleteDialogClose}>
          <DialogTitle>Delete Asset</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this asset?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose}>Cancel</Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

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
