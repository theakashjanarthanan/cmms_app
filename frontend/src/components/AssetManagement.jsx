// frontend\src\components\AssetManagement.jsx

import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
} from "@mui/material";

import AuthContext from "../context/AuthContext"; // AuthContext provides user info

import styles from "../styles/assetManagement.module.css"; // CSS File

import API from "../api/api";
import Sidebar from "./Sidebar";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Add as AddIcon } from "@mui/icons-material";
import { Close as CloseIcon } from "@mui/icons-material";
// import { Info as InfoIcon } from "@mui/icons-material";
import { Delete as DelIcon } from "@mui/icons-material";
import WarningIcon from "@mui/icons-material/Warning";

const AssetManagement = () => {
  const { user } = useContext(AuthContext); // Get user info from context
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
  const [viewDialog, setViewDialog] = useState(false); // For view asset details
  const [deleteDialog, setDeleteDialog] = useState(false); // For delete confirmation
  const [assetToDelete, setAssetToDelete] = useState(null); // Asset selected for deletion
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [assets, setAssets] = useState([]);
  const [editingAsset, setEditingAsset] = useState(null); // Holds the asset being edited
  const [sortConfig, setSortConfig] = useState({
    key: "assetID",
    direction: "asc",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch Assets on Component Load and Check if the user has 'Inventory Manager' access
  useEffect(() => {
    // Fetch Assets on Component Load
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

    // Check if the user has 'Inventory Manager' access
    if (user?.role === "Inventory Manager") {
      setIsInventoryManager(true);
    } else {
      setIsInventoryManager(false);
    }

    fetchAssets();
  }, [user]);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Dialog Open/Close
  const handleDialogOpen = (asset = null) => {
    if (asset) {
      setFormData(asset);
      setEditingAsset(asset.assetID); // Mark as editing
    } else {
      resetForm();
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    resetForm();
    setOpenDialog(false);
  };

  // Handle View Dialog
  const handleViewDialogOpen = (asset) => {
    setFormData(asset);
    setViewDialog(true);
  };
  const handleViewDialogClose = () => {
    setViewDialog(false);
  };

  // Handle Delete Dialog
  const handleDeleteDialogOpen = (assetID) => {
    setAssetToDelete(assetID);
    setDeleteDialog(true);
  };
  const handleDeleteDialogClose = () => {
    setAssetToDelete(null);
    setDeleteDialog(false);
  };

  // Reset Form
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

  // Handle Snackbar Close
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  // Handle Submit (Create/Update)
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
        // Update existing asset
        await API.put(`/asset-management/${editingAsset}`, formData);
        setAssets((prevAssets) =>
          prevAssets.map((asset) =>
            asset.assetID === editingAsset ? { ...asset, ...formData } : asset,
          ),
        );
        setSnackbar({
          open: true,
          message: "Asset updated successfully!",
          type: "success",
        });
      } else {
        // Create new asset
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

  // Handle Delete
  const handleDelete = async () => {
    if (!assetToDelete) return;

    try {
      await API.delete(`/asset-management/${assetToDelete}`);
      setAssets((prevAssets) =>
        prevAssets.filter((asset) => asset.assetID !== assetToDelete),
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

  // Handle Sorting
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

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedAssets = sortedAssets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

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
          <div className={styles.container}>   
            <h1 className={styles.title}>Asset Management</h1>  
          </div>

          {/* Create Asset Button With RBAC */}
          {isInventoryManager && (
              <Button
              variant="contained"
              color="primary"
              onClick={() => handleDialogOpen()}
              className={styles.createButton} 
              startIcon={<AddIcon />}  
              >
              Create Asset
              </Button>
          )}
        </Box>

        <>
          {/* Table to Display the Assets */}
          <TableContainer
            component={Paper}
            className="table-container shadow-xl rounded-xl mt-5 mb-5 p-8"
            sx={{ overflowX: "auto" }}
          >
            <Table>
              <TableHead>
                <TableRow className="bg-gray-100 text-gray-700 font-semibold text-center">
                  <TableCell className="font-semibold py-4 px-8">
                    <TableSortLabel
                      active={sortConfig.key === "assetID"}
                      direction={sortConfig.direction}
                      onClick={() => handleSort("assetID")}
                    >
                      SNO
                    </TableSortLabel>
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    <TableSortLabel
                      active={sortConfig.key === "assetID"}
                      direction={sortConfig.direction}
                      onClick={() => handleSort("assetID")}
                    >
                      AS ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    Display Name
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    Department
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    Serial Number
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    Warranty
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    Status
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAssets.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      align="center"
                      className="no-data py-6"
                    >
                      No assets available.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAssets.map((asset, index) => (
                    <TableRow
                      key={asset.assetID}
                      className="hover:bg-gray-50 transition-all table-row"
                      style={{ height: "70px" }}
                    >
                      <TableCell className="px-8 py-4 text-center font-medium">
                        {index + 1 + page * rowsPerPage}
                      </TableCell>
                      <TableCell className="px-8 py-4 font-medium">
                        {asset.assetID}
                      </TableCell>
                      <TableCell className="px-8 py-4 font-medium">
                        {asset.displayName}
                      </TableCell>
                      <TableCell className="px-8 py-4 font-medium">
                        {asset.department}
                      </TableCell>
                      <TableCell className="px-8 py-4 font-medium">
                        {asset.serialNumber}
                      </TableCell>
                      <TableCell className="px-8 py-4 font-medium">
                        {asset.warrantyStatus}
                      </TableCell>
                      <TableCell className="px-8 py-4 font-medium">
                        {asset.status}
                      </TableCell>
                      <TableCell className="px-8 py-4">
                        <div className="flex justify-center gap-10">
                          {" "}
                          <VisibilityIcon
                            className="action-icon view-icon text-blue-500"
                            sx={{ fontSize: 28 }}
                            onClick={() => handleViewDialogOpen(asset)}
                          />
                          {isInventoryManager && (
                            <>
                              <EditIcon
                                className="action-icon edit-icon text-green-500"
                                sx={{ fontSize: 28 }}
                                onClick={() => handleDialogOpen(asset)}
                              />
                              <DeleteIcon
                                className="action-icon delete-icon text-red-500"
                                sx={{ fontSize: 28 }}
                                onClick={() =>
                                  handleDeleteDialogOpen(asset.assetID)
                                }
                              />
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Table Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={assets.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className="pagination-container"
            />
          </TableContainer>
        </>

        {/* Dialogs (Create/Edit, View, Delete) */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>
            {editingAsset ? "Edit Asset" : "Create Asset"}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="assetID"
                    label="Asset ID"
                    value={formData.assetID}
                    onChange={handleChange}
                    disabled={!!editingAsset}
                    required
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="name"
                    label="Asset Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="displayName"
                    label="Display Name"
                    value={formData.displayName}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="description"
                    label="Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="status"
                    select
                    label="Status"
                    value={formData.status}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="Operational">Operational</MenuItem>
                    <MenuItem value="Out of Service">Out of Service</MenuItem>
                  </TextField>
                  <TextField
                    name="model"
                    label="Model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="manufacturer"
                    label="Manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="serialNumber"
                    label="Serial Number"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="department"
                    label="Department"
                    value={formData.department}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="warrantyStatus"
                    select
                    label="Warranty Status"
                    value={formData.warrantyStatus}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="Warranty">Warranty</MenuItem>
                    <MenuItem value="Out of Warranty">Out of Warranty</MenuItem>
                  </TextField>
                  <TextField
                    name="warrantyExpirationDate"
                    label="Warranty Expiration Date"
                    type="date"
                    value={formData.warrantyExpirationDate}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} className={styles.closeButton}>
              Close
            </Button>
            <Button
              onClick={handleSubmit}
              className={styles.dialogActionsButton}
              style={{ color:"white", backgroundColor: "#E01E5A" }}
              disabled={loading}
            >
              {loading ? "Saving..." : editingAsset ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Asset Dialog */}
        <Dialog
          open={viewDialog}
          onClose={handleViewDialogClose}
          className={styles.viewDialog}
        >
          <DialogTitle className={styles.dialogTitle}>
            {/* <InfoIcon className={styles.dialogIcon} /> */}
            View Asset Details
          </DialogTitle>
          <DialogContent className={styles.dialogContent}>
            <Grid container spacing={3}>
              {/* Asset Details */}
              <Grid item xs={12} sm={6} className={styles.gridItem}>
                <Typography variant="h6" className={styles.viewLabel}>
                  Asset ID:
                </Typography>
                <Typography variant="body1" className={styles.viewValue}>
                  {formData.assetID}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} className={styles.gridItem}>
                <Typography variant="h6" className={styles.viewLabel}>
                  Asset Name:
                </Typography>
                <Typography variant="body1" className={styles.viewValue}>
                  {formData.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} className={styles.gridItem}>
                <Typography variant="h6" className={styles.viewLabel}>
                  Display Name:
                </Typography>
                <Typography variant="body1" className={styles.viewValue}>
                  {formData.displayName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} className={styles.gridItem}>
                <Typography variant="h6" className={styles.viewLabel}>
                  Status:
                </Typography>
                <Typography variant="body1" className={styles.viewValue}>
                  {formData.status}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} className={styles.gridItem}>
                <Typography variant="h6" className={styles.viewLabel}>
                  Model:
                </Typography>
                <Typography variant="body1" className={styles.viewValue}>
                  {formData.model}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} className={styles.gridItem}>
                <Typography variant="h6" className={styles.viewLabel}>
                  Manufacturer:
                </Typography>
                <Typography variant="body1" className={styles.viewValue}>
                  {formData.manufacturer}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} className={styles.gridItem}>
                <Typography variant="h6" className={styles.viewLabel}>
                  Serial Number:
                </Typography>
                <Typography variant="body1" className={styles.viewValue}>
                  {formData.serialNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} className={styles.gridItem}>
                <Typography variant="h6" className={styles.viewLabel}>
                  Department:
                </Typography>
                <Typography variant="body1" className={styles.viewValue}>
                  {formData.department}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} className={styles.gridItem}>
                <Typography variant="h6" className={styles.viewLabel}>
                  Warranty Status:
                </Typography>
                <Typography variant="body1" className={styles.viewValue}>
                  {formData.warrantyStatus}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} className={styles.gridItem}>
                <Typography variant="h6" className={styles.viewLabel}>
                  Warranty Expiration:
                </Typography>
                <Typography
                  variant="body1"
                  className={styles.viewWarrantyExpiration}
                >
                  {formData.warrantyExpirationDate
                    ? new Date(formData.warrantyExpirationDate).toLocaleString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                          hour12: true,
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} className={styles.gridItem}>
                <Typography variant="h6" className={styles.viewLabel}>
                  Created At:
                </Typography>
                <Typography variant="body1" className={styles.viewValue}>
                  {new Date(formData.createdAt).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} className={styles.gridItem}>
                <Typography variant="h6" className={styles.viewLabel}>
                  Updated At:
                </Typography>
                <Typography variant="body1" className={styles.viewUpdatedAt}>
                  {formData.updatedAt
                    ? new Date(formData.updatedAt).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: true,
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{ padding: "16px 24px", justifyContent: "center" }}
          >
            <Button
              onClick={handleViewDialogClose}
              className={styles.viewCloseButton}
              startIcon={<CloseIcon />}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialog} onClose={handleDeleteDialogClose}>
          <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
            <WarningIcon sx={{ marginRight: "8px", color: "#f44336" }} />
            Delete Asset
          </DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this asset?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="secondary">
              No
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              startIcon={<DelIcon />}
              className="deleteButton"
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for Status Messages */}
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
