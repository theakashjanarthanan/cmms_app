import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

import Sidebar from "../components/Sidebar";
import AssetDialog from "../components/AssetManagementDialogs/AssetDialog";
import ViewAssetDialog from "../components/AssetManagementDialogs/ViewAssetDialog";
import AssetTable from "../components/AssetManagementDialogs/AssetTable";

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

  const sidebarWidth = isSidebarMinimized ? 70 : 260;

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const data = await fetchAssets();
        setAssets(data);
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

  const handleViewDialogOpen = async (asset) => {
    try {
      // Fetch the asset details from the backend using its ID
      const fetchedAsset = await fetchSingleAsset(asset._id); // Pass the _id of the Selected Asset
      setFormData(fetchedAsset); // Set the form data to the fetched asset details
      setViewDialog(true); // Open the dialog to view the asset details
    } catch (error) {
      console.error("Error fetching asset details:", error);
      setSnackbar({
        open: true,
        message: "Error fetching asset details.",
        type: "error",
      });
    }
  };

  const handleViewDialogClose = () => {
    setViewDialog(false);
  };

  const handleDeleteDialogOpen = (assetId) => {
    setAssetToDelete(assetId);
    setDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setAssetToDelete(null);
    setDeleteDialog(false);
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

  const toggleSidebar = () => {
    setIsSidebarMinimized((prev) => !prev);
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Asset Management
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDialogOpen()}
          >
            Create Asset
          </Button>
        </Box>

        <AssetTable
          assets={assets}
          onView={handleViewDialogOpen} // Pass the function to handle asset view
          onEdit={handleDialogOpen}
          onDelete={handleDeleteDialogOpen}
        />

        <AssetDialog
          open={openDialog}
          onClose={handleDialogClose}
          onSubmit={handleSubmit}
          loading={loading}
          editingAsset={editingAsset}
          formData={formData}
          handleChange={handleChange}
        />

        <ViewAssetDialog
          viewDialog={viewDialog}
          handleViewDialogClose={handleViewDialogClose}
          formData={formData} // Pass the fetched data to ViewAssetDialog
        />

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
    </Box>
  );
};

export default AssetManagement;
