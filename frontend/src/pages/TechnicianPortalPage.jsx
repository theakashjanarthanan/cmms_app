// frontend\src\components\TechnicianPortalPage.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
  Snackbar,
  Alert,
  Grid
} from '@mui/material';
import Sidebar from "../components/Sidebar";
import {
  fetchActiveTechnicians,
  fetchWorkOrders,
  updateApprovalStatus,
  deleteWorkOrder,
} from '../api/api';

const TechnicianPortalPage = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);  // Sidebar minimized state
  const [openDialog, setOpenDialog] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [newApprovalStatus, setNewApprovalStatus] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // For delete confirmation dialog
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false); // For approval status update dialog
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

  const sidebarWidth = isSidebarMinimized ? 70 : 250;  // Sidebar width based on minimized state

  // Fetch work orders
  useEffect(() => {
    const fetchWorkOrdersData = async () => {
      try {
        const data = await fetchWorkOrders();
        setWorkOrders(data);
      } catch (error) {
        console.error("Error fetching work orders:", error);
      }
    };
    fetchWorkOrdersData();
  }, []);

  // Fetch active technicians
  const handleClickOpen = async () => {
    try {
      const response = await fetchActiveTechnicians();
      const sortedTechnicians = response.sort((a, b) =>
        b._id.localeCompare(a._id),
      ); // Sorting newest first
      setTechnicians(sortedTechnicians);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleApprovalStatusChange = async () => {
    try {
      const response = await updateApprovalStatus(
        selectedOrderId,
        newApprovalStatus,
      );
      if (response) {
        const updatedOrders = workOrders.map((order) =>
          order._id === selectedOrderId
            ? { ...order, approvalStatus: newApprovalStatus }
            : order,
        );
        setWorkOrders(updatedOrders);
        setNewApprovalStatus("");
        setSelectedOrderId("");
        setOpenApprovalDialog(false); // Close the approval dialog after update
      }
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  // Slice workOrders to display only the rows for the current page
  const paginatedWorkOrders = workOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  // Delete function
  const handleDelete = async () => {
    try {
      await deleteWorkOrder(selectedOrderId);
      const updatedWorkOrders = workOrders.filter(
        (order) => order._id !== selectedOrderId,
      );
      setWorkOrders(updatedWorkOrders);

      setSnackbarMessage("Work order deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenDeleteDialog(false); // Close the delete confirmation dialog
    } catch (error) {
      console.error("Error deleting work order:", error);

      setSnackbarMessage("Failed to delete work order.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setOpenDeleteDialog(false); // Close the delete confirmation dialog
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const openDeleteConfirmationDialog = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenDeleteDialog(true);
  };

  const closeDeleteConfirmationDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedOrderId(""); // Clear selected order when dialog is closed
  };

  const openApprovalStatusDialog = (orderId) => {
    setSelectedOrderId(orderId);
    setOpenApprovalDialog(true); // Open approval status dialog
  };

  const closeApprovalStatusDialog = () => {
    setOpenApprovalDialog(false);
    setSelectedOrderId(""); // Clear selected order when dialog is closed
  };

  const openViewDialog = (order) => {
    setSelectedWorkOrder(order);
    setViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedWorkOrder(null); // Reset selected work order when closing
  };

    // Toggle Sidebar minimized/maximized state
    const toggleSidebar = () => {
      setIsSidebarMinimized(!isSidebarMinimized);
    };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Component */}
      <Sidebar isMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} />

      <Box
        sx={{
          flexGrow: 1,
          ml: `${sidebarWidth}px`, // Dynamically adjust margin-left based on sidebar width
          transition: "margin-left 0.3s ease", // Smooth transition for layout changes
          p: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to the Technician Portal
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          sx={{ mb: 3 }}
        >
          Active Technicians
        </Button>
 
        {/* Active Technicians Dialog */}
        <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Active Technicians</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>S No</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {technicians.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography>No active technicians available</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    technicians.map((technician, index) => (
                      <TableRow key={technician._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{technician.fullName}</TableCell>
                        <TableCell>{technician.email}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Work Orders Table */}
        <Typography variant="h5" gutterBottom>
          Work Orders
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>S No</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Display Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Asset</TableCell>
                <TableCell>Worker</TableCell>
                <TableCell>Team</TableCell>
                <TableCell>Approval Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedWorkOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    <Typography>No work orders available</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedWorkOrders.map((order, index) => (
                  <TableRow key={order._id}>
                    <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell>{order.title}</TableCell>
                    <TableCell>{order.displayName}</TableCell>
                    <TableCell>{order.description}</TableCell>
                    <TableCell>
                      {new Date(order.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.dueDate
                        ? new Date(order.dueDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>{order.priority || "N/A"}</TableCell>
                    <TableCell>{order.category || "N/A"}</TableCell>
                    <TableCell>{order.location || "N/A"}</TableCell>
                    <TableCell>{order.asset?.name || "N/A"}</TableCell>
                    <TableCell>{order.worker?.fullName || "N/A"}</TableCell>
                    <TableCell>{order?.team?.name || "N/A"}</TableCell>
                    <TableCell>{order.approvalStatus}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => openViewDialog(order)} // Open View Dialog
                      >
                        View
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => openApprovalStatusDialog(order._id)} // Open approval status dialog
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => openDeleteConfirmationDialog(order._id)} // Open delete confirmation dialog
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={workOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Update Approval Status Dialog */}
        {openApprovalDialog && (
          <Dialog open={openApprovalDialog} onClose={closeApprovalStatusDialog}>
            <DialogTitle>Update Approval Status</DialogTitle>
            <DialogContent>
              <FormControl fullWidth>
                <InputLabel>Approval Status</InputLabel>
                <Select
                  value={newApprovalStatus}
                  onChange={(e) => setNewApprovalStatus(e.target.value)}
                  label="Approval Status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeApprovalStatusDialog} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleApprovalStatusChange} color="primary">
                Update
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={closeDeleteConfirmationDialog}>
          <DialogTitle>Are you sure to delete this work order?</DialogTitle>
          <DialogActions>
            <Button onClick={closeDeleteConfirmationDialog} color="secondary">
              No
            </Button>
            <Button onClick={handleDelete} color="error">
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Work Order Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={closeViewDialog}
          sx={{
            backdropFilter: "blur(5px)",
            background: "rgba(255, 255, 255, 0.9)",
          }}
        >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            backgroundColor: "#f5f5f5",
            padding: "16px 24px",
          }}
        >
          View Work Order Details
        </DialogTitle>
        <DialogContent sx={{ padding: "24px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Display Name:
              </Typography>
              <Typography variant="body1">
                {selectedWorkOrder?.displayName || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Description:
              </Typography>
              <Typography variant="body1">
                {selectedWorkOrder?.description || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Start Date:
              </Typography>
              <Typography variant="body1">
                {selectedWorkOrder?.formattedStartDate || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Due Date:
              </Typography>
              <Typography variant="body1">
                {selectedWorkOrder?.formattedDueDate || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Priority:
              </Typography>
              <Typography variant="body1">
                {selectedWorkOrder?.priority || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Category:
              </Typography>
              <Typography variant="body1">
                {selectedWorkOrder?.category || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Location:
              </Typography>
              <Typography variant="body1">
                {selectedWorkOrder?.location || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Asset:
              </Typography>
              <Typography variant="body1">
                {selectedWorkOrder?.asset?.name || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Worker:
              </Typography>
              <Typography variant="body1">
                {selectedWorkOrder?.worker?.fullName || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Created At:
              </Typography>
              <Typography variant="body1">
                {selectedWorkOrder?.formattedCreatedAt || "Not Available"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Updated At:
              </Typography>
              <Typography variant="body1">
                {selectedWorkOrder?.formattedUpdatedAt || "Not Available"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Approval Status:
              </Typography>
              <Typography variant="body1">
                {selectedWorkOrder?.approvalStatus || "Not Available"}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={closeViewDialog}
            sx={{ width: "100%", maxWidth: "200px" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TechnicianPortalPage;
