// frontend\src\components\AssetManagement.jsx

import React, { useState, useEffect, useContext } from "react";
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

import AuthContext from "../context/AuthContext";

import API from "../api/api"; // API

import Sidebar from "./Sidebar"; // Sidebar

import AssetDialog from "./AssetManagementDialogs/AssetDialog";          // Asset Creation and Updation Dialog
import ViewAssetDialog from "./AssetManagementDialogs/ViewAssetDialog";  // View Dialog
import AssetTable from "./AssetManagementDialogs/AssetTable";            // Asset Table

const AssetManagement = () => {
  const { user } = useContext(AuthContext); // Get user info from context

  // States
  const [isInventoryManager, setIsInventoryManager] = useState(false);
  const [formData, setFormData] = useState({
    assetID: "",
    name: "",
    displayName: "",
    description: "",
    status: "Operational",
    model: "",
    manufacturer: "",
    serialNumber: "",
    department: "",
    warrantyStatus: "Warranty",
    warrantyExpirationDate: "",
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
  const [sortConfig, setSortConfig] = useState({
    key: "assetID",
    direction: "desc",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch assets and check user role
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const { data } = await API.get("/asset-management");
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

    if (user?.role === "Inventory Manager") {
      setIsInventoryManager(true);
    } else {
      setIsInventoryManager(false);
    }

    fetchAssets();
  }, [user]);

  // Handlers for dialogs
  const handleDialogOpen = (asset = null) => {
    if (asset) {
      setFormData(asset);
      setEditingAsset(asset.assetID);
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    resetForm();
    setOpenDialog(false);
  };

  const handleViewDialogOpen = (asset) => {
    setFormData(asset);
    setViewDialog(true);
  };

  const handleViewDialogClose = () => {
    setViewDialog(false);
  };

  const handleDeleteDialogOpen = (assetID) => {
    setAssetToDelete(assetID);
    setDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setAssetToDelete(null);
    setDeleteDialog(false);
  };

  // Form and snackbar handlers
  const resetForm = () => {
    setFormData({
      assetID: "",
      name: "",
      displayName: "",
      description: "",
      status: "Operational",
      model: "",
      manufacturer: "",
      serialNumber: "",
      department: "",
      warrantyStatus: "Warranty",
      warrantyExpirationDate: "",
    });
    setEditingAsset(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // CRUD operations
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.assetID) {
      setSnackbar({
        open: true,
        message: "Asset ID is required!",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      if (editingAsset) {
        await API.put(`/asset-management/${editingAsset}`, formData);
        setAssets((prevAssets) =>
          prevAssets.map((asset) =>
            asset.assetID === editingAsset ? { ...asset, ...formData } : asset
          )
        );
        setSnackbar({
          open: true,
          message: "Asset updated successfully!",
          type: "success",
        });
      } else {
        const { data } = await API.post("/asset-management", formData);
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
      await API.delete(`/asset-management/${assetToDelete}`);
      setAssets((prevAssets) =>
        prevAssets.filter((asset) => asset.assetID !== assetToDelete)
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

  // Sorting and pagination
  const handleSort = (key) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === "asc";
    setSortConfig({ key, direction: isAsc ? "desc" : "asc" });
  };

  const sortedAssets = [...assets].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedAssets = sortedAssets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, ml: "250px", p: 3 }}>
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
          {isInventoryManager && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleDialogOpen()}
            >
              Create Asset
            </Button>
          )}
        </Box>

        <AssetTable
          assets={assets}
          paginatedAssets={paginatedAssets}
          page={page}
          rowsPerPage={rowsPerPage}
          sortConfig={sortConfig}
          handleSort={handleSort}
          handleViewDialogOpen={handleViewDialogOpen}
          handleDialogOpen={handleDialogOpen}
          handleDeleteDialogOpen={handleDeleteDialogOpen}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          isInventoryManager={isInventoryManager}
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
          formData={formData}
        />

        <Dialog open={deleteDialog} onClose={handleDeleteDialogClose}>
          <DialogTitle>Delete Asset</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this asset?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="secondary">
              No
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
