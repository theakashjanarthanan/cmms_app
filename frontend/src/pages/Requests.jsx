// frontend\src\components\Requests.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";

import {
  createRequest,
  fetchRequests,
  updateRequest,
  deleteRequest,
  updateRequestsApprovalStatus,
  fetchActiveTechnicians,
  fetchAssets,
  createWorkOrder,
  convertToWorkOrder,
} from "../api/api";

import Sidebar from "../components/Sidebar";

const Requests = () => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false); // Sidebar minimized state
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [requestData, setRequestData] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "Pending",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [newApprovalStatus, setNewApprovalStatus] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' | 'error' | 'warning' | 'info'

  // State for table and pagination
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editRequestId, setEditRequestId] = useState(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  // State for the "Approve as Work Order" form fields
  const [displayName, setDisplayName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [setAsset] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [status] = useState("Pending");
  const [workerDialogOpen, setWorkerDialogOpen] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [assets, setAssets] = useState([]);

  const sidebarWidth = isSidebarMinimized ? 70 : 250; // Sidebar width based on minimized state

  // Fetch requests from the backend
  useEffect(() => {
    const getRequests = async () => {
      try {
        const data = await fetchRequests();
        const sortedRequests = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setRequests(sortedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    getRequests();
  }, []);

  // Fetch active technicians when the component mounts
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const data = await fetchActiveTechnicians();
        setTechnicians(data);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      }
    };
    fetchTechnicians();
  }, []);

  // Fetch assets from the backend
  useEffect(() => {
    const getAssets = async () => {
      try {
        const data = await fetchAssets();
        setAssets(data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    getAssets();
  }, []);

  // Handle opening the Worker Dialog
  const handleOpenWorkerDialog = () => {
    setWorkerDialogOpen(true);
  };

  // Handle selecting a worker from the dialog
  const handleSelectWorker = (worker) => {
    setSelectedWorker(worker); // Set selected worker
    setWorkerDialogOpen(false); // Close the worker selection dialog
  };

  const handleSubmit = () => {
    setOpenConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setOpenConfirmDialog(false);
    try {
      if (editRequestId) {
        // Edit request
        await updateRequest(editRequestId, requestData);
        setMessage("Request updated successfully!");
      } else {
        // Create request
        await createRequest(requestData);
        setMessage("Request created successfully!");
      }
      setMessageType("success");
    } catch (error) {
      setMessage("Failed to create or update request. Please try again.");
      setMessageType("error");
    }
    setOpenSnackbar(true);
    setOpenDialog(false);
    fetchRequests();
  };

  const handleEdit = (request) => {
    setRequestData({
      title: request.title,
      description: request.description,
      priority: request.priority,
      status: request.status,
    });
    setEditRequestId(request._id);
    setOpenDialog(true);
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleStatusChange = (event) => {
  //   setStatus(event.target.value);
  // };

  const handleView = (request) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
  };

  const handleDelete = (id) => {
    setRequestToDelete(id);
    setOpenDeleteConfirm(true);
  };

  const openApprovalStatusDialog = (id, currentStatus) => {
    setSelectedRequestId(id);
    setNewApprovalStatus(currentStatus); // Set the current status as default
    setOpenApprovalDialog(true);
  };

  const closeApprovalStatusDialog = () => {
    setOpenApprovalDialog(false);
    setSelectedRequestId(null);
    setNewApprovalStatus("");
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const confirmDelete = async () => {
    try {
      await deleteRequest(requestToDelete);
      setRequests(
        requests.filter((request) => request._id !== requestToDelete),
      );
      setMessage("Request deleted successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage("Failed to delete request. Please try again.");
      setMessageType("error");
    }
    setOpenDeleteConfirm(false);
    setOpenSnackbar(true);
  };

  const handleApprovalStatusChange = async () => {
    try {
      // Call your API
      await updateRequestsApprovalStatus(selectedRequestId, newApprovalStatus);
      fetchRequests(); // Refresh requests
      showSnackbar("Approval status updated successfully", "success");
      closeApprovalStatusDialog();
    } catch (error) {
      showSnackbar("Failed to update approval status", "error");
    }
  };

  const handleCreateWorkOrder = async () => {
    const workOrderData = {
      title: selectedRequest?.title,
      displayName: displayName,
      description: selectedRequest?.description,
      startDate: startDate,
      dueDate: dueDate,
      category: category,
      status: status,
      priority: selectedRequest?.priority,
      location: location,
      worker: selectedWorker?._id,
      asset: selectedAsset?._id,
    };

    try {
      // Step 1: Create the work order
      const response = await createWorkOrder(workOrderData);
      console.log(response);

      // Step 2: Convert the request's status to "Converted as Work Order"
      await convertToWorkOrder(selectedRequest?._id);

      // Step 3: Show success message
      setSnackbarMessage(
        "Work order created and request converted successfully",
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      handleCloseApproveDialog();
    } catch (error) {
      setSnackbarMessage("Error creating work order or updating request");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error creating work order:", error);
    }
  };

  const handleCloseApproveDialog = () => {
    setApproveDialogOpen(false);
  };

  const handleOpenApproveDialog = () => {
    setApproveDialogOpen(true);
  };

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
    setAssetDialogOpen(false);
  };

  // Toggle Sidebar minimized/maximized state
  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar isMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          ml: `${sidebarWidth}px`, // Dynamically adjust margin-left based on sidebar width
          transition: "margin-left 0.3s ease", // Smooth transition for layout changes
          p: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome to the Requests Module
        </Typography>
        <Typography variant="body1" paragraph>
          This is the Requests module where you can manage all the requests.
        </Typography>

        {/* Create Request Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Create Request
        </Button>

        {/* Dialog for creating or editing request */}
        <Dialog open={openDialog} onClose={handleCancel}>
          <DialogTitle>
            {editRequestId ? "Edit Request" : "Create Request"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              variant="outlined"
              value={requestData.title}
              onChange={(e) =>
                setRequestData({ ...requestData, title: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              variant="outlined"
              value={requestData.description}
              onChange={(e) =>
                setRequestData({ ...requestData, description: e.target.value })
              }
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Priority</InputLabel>
              <Select
                value={requestData.priority}
                onChange={(e) =>
                  setRequestData({ ...requestData, priority: e.target.value })
                }
                label="Priority"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
            {/* <FormControl fullWidth margin='dense'>
              <InputLabel>Status</InputLabel>
              <Select
                value={requestData.status}
                onChange={e =>
                  setRequestData({ ...requestData, status: e.target.value })
                }
                label='Status'
              >
                <MenuItem value='Pending'>Pending</MenuItem>
                <MenuItem value='Approved'>Approved</MenuItem>
              </Select>
            </FormControl> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {editRequestId ? "Update" : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
        >
          <DialogTitle>
            Are you sure you want to {editRequestId ? "update" : "create"} this
            request?
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => setOpenConfirmDialog(false)}
              color="secondary"
            >
              No
            </Button>
            <Button onClick={handleConfirmSubmit} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Table to display requests */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="requests table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell> {/* Add Serial Number column */}
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No requests available.
                  </TableCell>
                </TableRow>
              ) : (
                requests
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((request, index) => (
                    <TableRow key={request._id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>{" "}
                      {/* Display auto-incrementing serial number */}
                      <TableCell>{request.title}</TableCell>
                      <TableCell>{request.description}</TableCell>
                      <TableCell>{request.priority}</TableCell>
                      <TableCell>{request.status}</TableCell>
                      <TableCell>
                        {new Date(request.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(request.updatedAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleView(request)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleEdit(request)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(request._id)}
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() =>
                            openApprovalStatusDialog(
                              request._id,
                              request.status,
                            )
                          }
                          color="primary"
                          variant="contained"
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* View Request Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={handleCloseViewDialog}
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
            View Request Details
          </DialogTitle>
          <DialogContent sx={{ padding: "24px" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Title:
                </Typography>
                <Typography variant="body1">
                  {selectedRequest?.title || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Description:
                </Typography>
                <Typography variant="body1">
                  {selectedRequest?.description || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Priority:
                </Typography>
                <Typography variant="body1">
                  {selectedRequest?.priority || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Status:
                </Typography>
                <Typography variant="body1">
                  {selectedRequest?.status || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Created At:
                </Typography>
                <Typography variant="body1">
                  {selectedRequest?.createdAt
                    ? new Date(selectedRequest.createdAt).toLocaleString()
                    : "Not Available"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Updated At:
                </Typography>
                <Typography variant="body1">
                  {selectedRequest?.updatedAt
                    ? new Date(selectedRequest.updatedAt).toLocaleString()
                    : "Not Available"}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{ padding: "16px 24px", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseViewDialog}
              sx={{ width: "100%", maxWidth: "200px" }}
            >
              Close
            </Button>

            {selectedRequest?.status === "Approved" && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpenApproveDialog}
                sx={{ width: "100%", maxWidth: "200px" }}
              >
                Approve as Work Order
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Approve as Work Order Dialog */}
        <Dialog
          open={approveDialogOpen}
          onClose={handleCloseApproveDialog}
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
            Approve as Work Order
          </DialogTitle>
          <DialogContent sx={{ padding: "24px" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Title:
                </Typography>
                <TextField
                  fullWidth
                  name="status"
                  value={selectedRequest?.title || "N/A"}
                  variant="outlined"
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Display Name:
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Description:
                </Typography>
                <TextField
                  fullWidth
                  name="status"
                  value={selectedRequest?.description || "N/A"}
                  variant="outlined"
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Start Date:
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Due Date:
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Category:
                </Typography>
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  select
                  variant="outlined"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Damage">Damage</MenuItem>
                  <MenuItem value="Electrical">Electrical</MenuItem>
                  <MenuItem value="Inspection">Inspection</MenuItem>
                  <MenuItem value="Meter">Meter</MenuItem>
                  <MenuItem value="Preventative">Preventative</MenuItem>
                  <MenuItem value="Project">Project</MenuItem>
                  <MenuItem value="Safety">Safety</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Status:
                </Typography>
                <TextField
                  fullWidth
                  name="status"
                  value={selectedRequest?.status || "N/A"}
                  variant="outlined"
                  disabled
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Location:
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Worker:
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Select Worker"
                  name="worker"
                  value={selectedWorker ? selectedWorker.fullName : ""} // Display selected worker's name
                  onClick={handleOpenWorkerDialog} // Open dialog on click
                  InputProps={{
                    readOnly: true, // Make it read-only to act as a button
                  }}
                />
              </Grid>

              {/* Select Worker Dialog */}
              <Dialog
                open={workerDialogOpen}
                onClose={() => setWorkerDialogOpen(false)}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle>Select Worker</DialogTitle>
                <DialogContent>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>S No</TableCell>
                          <TableCell>Full Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Select</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {technicians.map((tech, index) => (
                          <TableRow key={tech._id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{tech.fullName}</TableCell>
                            <TableCell>{tech.email}</TableCell>
                            <TableCell>
                              <Button onClick={() => handleSelectWorker(tech)}>
                                Select
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                  <Button
                    onClick={() => setWorkerDialogOpen(false)}
                    variant="contained"
                    color="secondary"
                  >
                    Close
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Snackbar for Success/Failure */}
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000} // Time the Snackbar will be shown
                onClose={handleCloseSnackbar}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <Alert
                  onClose={handleCloseSnackbar}
                  severity={snackbarSeverity} // 'success' or 'error'
                  sx={{ width: "100%" }}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Asset:
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Select Asset"
                  name="asset"
                  value={selectedAsset?.name || ""}
                  onChange={(e) => setAsset(e.target.value)}
                  onClick={() => setAssetDialogOpen(true)}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* Asset Selection Dialog */}
            <Dialog
              open={assetDialogOpen}
              onClose={() => setAssetDialogOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Select Asset</DialogTitle>
              <DialogContent>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>S No</TableCell>
                        <TableCell>Asset Name</TableCell>
                        <TableCell>Model</TableCell>
                        <TableCell>Select</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assets.map((asset, index) => (
                        <TableRow key={asset._id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell>{asset.model}</TableCell>
                          <TableCell>
                            <Button onClick={() => handleSelectAsset(asset)}>
                              Select
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </DialogContent>
              <DialogActions sx={{ justifyContent: "center" }}>
                <Button
                  onClick={() => setAssetDialogOpen(false)}
                  variant="contained"
                  color="secondary"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </DialogContent>
          <DialogActions
            sx={{ padding: "16px 24px", justifyContent: "center" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateWorkOrder}
              sx={{ width: "100%", maxWidth: "200px" }}
            >
              Create
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCloseApproveDialog}
              sx={{ width: "100%", maxWidth: "200px" }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={openDeleteConfirm}
          onClose={() => setOpenDeleteConfirm(false)}
        >
          <DialogTitle>
            Are you sure you want to delete this request?
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => setOpenDeleteConfirm(false)}
              color="secondary"
            >
              No
            </Button>
            <Button onClick={confirmDelete} color="error">
              Yes, Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={requests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Snackbar to show success or error messages */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          message={message}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          severity={messageType}
        />
      </Box>
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Requests;
