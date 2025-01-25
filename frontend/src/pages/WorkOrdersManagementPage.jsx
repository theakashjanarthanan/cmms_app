// frontend/src/components/WorkOrdersManagementPage.jsx

import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

import {
  fetchWorkOrders,
  createWorkOrder,
  updateWorkOrder,
  deleteWorkOrder,
  fetchActiveTechnicians,
  fetchAssets,
  fetchTeams,
  markWorkOrderAsCompleted,
} from "../api/api";

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Sidebar from "../components/Sidebar";
import AuthContext from "../context/AuthContext";

const WorkOrdersManagementPage = () => {
  const { user } = useContext(AuthContext);

  // Check if user role is Admin or Manager
  const isAdminOrManager = user?.role === "Admin" || user?.role === "Manager";
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [workOrders, setWorkOrders] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerDialogOpen, setWorkerDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [setSelectedAsset] = useState(null);
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [deleteConfirmationDialog, setDeleteConfirmationDialog] =
    useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openApprovalDialog, setOpenApprovalDialog] = useState(false);
  const [newApprovalStatus, setNewApprovalStatus] = useState("");
  const [teams, setTeams] = useState([]);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  // const [orderStatus] = useState(selectedWorkOrder?.status || "");

  const sidebarWidth = isSidebarMinimized ? 70 : 260;

  const [newWorkOrder, setNewWorkOrder] = useState({
    title: "",
    displayName: "",
    description: "",
    startDate: "",
    dueDate: "",
    priority: "",
    category: "",
    location: "",
    approvalStatus: "Pending", // Default value for approvalStatus
    orderStatus: "Open",
    worker: null, // Worker input field
    asset: null, // Asset input field
    team: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching work orders, technicians, and assets
        const workOrdersData = await fetchWorkOrders();
        setWorkOrders(workOrdersData);

        const techniciansData = await fetchActiveTechnicians();
        setTechnicians(techniciansData);

        const assetsData = await fetchAssets();
        setAssets(assetsData);

        // Fetching teams using native fetch API
        const teamsResponse = await fetch("/api/teams");
        if (!teamsResponse.ok) {
          throw new Error("Failed to fetch teams");
        }
        const teamsData = await teamsResponse.json();
        setTeams(teamsData); // Set teams data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkOrder({ ...newWorkOrder, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedWorkOrder({ ...selectedWorkOrder, [name]: value });
  };

  const handleOpenWorkerDialog = async () => {
    try {
      const activeTechnicians = await fetchActiveTechnicians();
      setTechnicians(activeTechnicians);
      setWorkerDialogOpen(true);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  };

  const handleSelectWorker = (technician) => {
    setSelectedWorker(technician);
    setNewWorkOrder({ ...newWorkOrder, worker: technician._id });
    setWorkerDialogOpen(false);
  };

  const handleSelectAsset = (asset) => {
    setNewWorkOrder({
      ...newWorkOrder,
      asset: asset._id,
      assetName: asset.name,
    });
    setAssetDialogOpen(false);
  };

  const handleCreateWorkOrder = async () => {
    try {
      const createdWorkOrder = await createWorkOrder(newWorkOrder);
      setWorkOrders([
        {
          ...createdWorkOrder,
          formattedCreatedAt: createdWorkOrder.formattedCreatedAt,
          formattedUpdatedAt: createdWorkOrder.formattedUpdatedAt,
        },
        ...workOrders,
      ]);
      setOpenDialog(false);
      setNewWorkOrder({
        title: "",
        displayName: "",
        description: "",
        startDate: "",
        dueDate: "",
        priority: "",
        category: "",
        location: "",
        orderStatus: "Open",
        approvalStatus: "Pending", // Default value for approvalStatus
        worker: null,
        asset: null,
        team: null,
      });
      setSelectedWorker(null);
      setSelectedAsset(null);

      // Display success message in Snackbar
      setSnackbarMessage("Work order created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error creating work order:", error);

      // Display error message in Snackbar
      setSnackbarMessage("Error creating work order. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleEditClick = (workOrder) => {
    setSelectedWorkOrder({
      ...workOrder,
      assetName: workOrder.asset?.name || "",
      formattedCreatedAt: workOrder.formattedCreatedAt,
      formattedUpdatedAt: workOrder.formattedUpdatedAt,
    });
    setEditDialogOpen(true);
  };

  const handleViewClick = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    setNewApprovalStatus(workOrder.orderStatus); // Set initial order status
    setViewDialogOpen(true);
  };

  const handleUpdateWorkOrder = async () => {
    try {
      const updatedWorkOrder = await updateWorkOrder(
        selectedWorkOrder._id,
        selectedWorkOrder,
      );

      setWorkOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedWorkOrder._id
            ? {
                ...updatedWorkOrder,
                formattedCreatedAt: updatedWorkOrder.formattedCreatedAt,
                formattedUpdatedAt: updatedWorkOrder.formattedUpdatedAt,
              }
            : order,
        ),
      );

      setEditDialogOpen(false);
      setConfirmationDialogOpen(false);

      // Display success message in Snackbar
      setSnackbarMessage("Work order updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating work order:", error);

      // Display error message in Snackbar
      setSnackbarMessage("Error updating work order. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteWorkOrder = async () => {
    try {
      await deleteWorkOrder(orderIdToDelete);
      setWorkOrders(
        workOrders.filter((order) => order._id !== orderIdToDelete),
      ); // Remove deleted work order from state
      setSnackbarMessage("Work order deleted successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("Error deleting work order:", error);
      setSnackbarMessage("Failed to delete work order!");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
      setDeleteConfirmationDialog(false); // Close the confirmation dialog
    }
  };

  const handleDeleteDialogOpen = (orderId) => {
    setOrderIdToDelete(orderId);
    setDeleteConfirmationDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteConfirmationDialog(false);
    setOrderIdToDelete(null); // Clear the order ID
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page changes
  };

  // Functions to handle status updates
  const handleApprovalStatusChange = async () => {
    try {
      // Set the new status to the selected work order
      setSelectedWorkOrder((prev) => ({
        ...prev,
        orderStatus: newApprovalStatus,
      }));

      // Call the update API to update the order status in the backend
      const updatedWorkOrder = await updateWorkOrder(selectedWorkOrder._id, {
        orderStatus: newApprovalStatus,
      });

      // Update the local state with the updated work order
      setWorkOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedWorkOrder._id ? { ...updatedWorkOrder } : order,
        ),
      );

      // Close the approval dialog after the update
      setOpenApprovalDialog(false);

      // Display success message
      setSnackbarMessage("Work order status updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating work order status:", error);
      setSnackbarMessage("Error updating work order status.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const closeApprovalStatusDialog = () => {
    setOpenApprovalDialog(false);
  };

  const handleMarkAsCompleted = async () => {
    try {
      // Use the API call to mark the work order as completed
      await markWorkOrderAsCompleted(selectedWorkOrder._id);

      // Update the local state to remove the completed work order
      setWorkOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== selectedWorkOrder._id),
      );

      // Show a success message
      setSnackbarMessage("Work order marked as completed successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Close the view dialog
      setViewDialogOpen(false);
    } catch (error) {
      console.error("Error marking work order as completed:", error);
      setSnackbarMessage("Error marking work order as completed.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Function to handle opening the Team dialog and fetching teams
  const handleOpenTeamDialog = async () => {
    try {
      const fetchedTeams = await fetchTeams();
      setTeams(fetchedTeams); // Update the state with the fetched teams
      setTeamDialogOpen(true); // Open the dialog
    } catch (error) {
      console.error("Error fetching teams:", error);
      setSnackbarMessage("Failed to fetch teams!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handle selecting a team from the dialog
  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setNewWorkOrder({
      ...newWorkOrder,
      team: team._id, // Set the selected team's _id into the newWorkOrder state
    });
    setTeamDialogOpen(false); // Close the dialog after selection
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
          ml: `${sidebarWidth}px`, // Dynamically adjust margin-left based on sidebar width
          transition: "margin-left 0.3s ease", // Smooth transition for layout changes
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
            Work Orders Management
          </Typography>
          {isAdminOrManager && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
            >
              Create Work Order
            </Button>
          )}
        </Box>

        {/* Dialog Box for Creating Work Order */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create Work Order</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Title"
              name="title"
              value={newWorkOrder.title}
              onChange={handleInputChange}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Display Name"
              name="displayName"
              value={newWorkOrder.displayName}
              onChange={handleInputChange}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              value={newWorkOrder.description}
              onChange={handleInputChange}
              required
              multiline
              rows={3}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Start Date"
              type="date"
              name="startDate"
              value={newWorkOrder.startDate}
              onChange={handleInputChange}
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Due Date"
              type="date"
              name="dueDate"
              value={newWorkOrder.dueDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Priority"
              name="priority"
              value={newWorkOrder.priority}
              onChange={handleInputChange}
              select
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              label="Category"
              name="category"
              value={newWorkOrder.category}
              onChange={handleInputChange}
              select
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

            <TextField
              fullWidth
              margin="normal"
              label="Location"
              name="location"
              value={newWorkOrder.location}
              onChange={handleInputChange}
              required
            />

            {/* TextField to Open Asset Dialog */}
            <TextField
              fullWidth
              margin="normal"
              label="Asset"
              name="asset"
              value={newWorkOrder.assetName || ""} // Display selected asset name
              onClick={() => setAssetDialogOpen(true)}
              InputProps={{
                readOnly: true,
              }}
            />

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

            {/* <TextField
              fullWidth
              margin="normal"
              label="Approval Status"
              name="approvalStatus"
              value={newWorkOrder.approvalStatus}
              onChange={handleInputChange}
              select
            >
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="On Hold">On Hold</MenuItem>
            </TextField> */}

            {/* TextField to Open Worker Dialog */}
            <TextField
              fullWidth
              margin="normal"
              label="Worker"
              name="worker"
              value={selectedWorker ? selectedWorker.fullName : ""}
              onClick={handleOpenWorkerDialog}
              InputProps={{
                readOnly: true,
              }}
            />

            {/* Worker Selection Dialog */}
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

            {/* Text Field for Team Selection */}
            <TextField
              fullWidth
              margin="normal"
              label="Team"
              name="team"
              value={selectedTeam ? selectedTeam.name : ""}
              onClick={handleOpenTeamDialog}
              InputProps={{
                readOnly: true, // Make it read-only to act as a button
              }}
            />

            {/* Team Selection Dialog */}
            <Dialog
              open={teamDialogOpen}
              onClose={() => setTeamDialogOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Select Team</DialogTitle>
              <DialogContent>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>S No</TableCell>
                        <TableCell>Team Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Select</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teams.map((team, index) => (
                        <TableRow key={team._id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{team.name}</TableCell>
                          <TableCell>{team.description}</TableCell>
                          <TableCell>
                            <Button onClick={() => handleSelectTeam(team)}>
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
                  onClick={() => setTeamDialogOpen(false)}
                  variant="contained"
                  color="secondary"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleCreateWorkOrder} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for Success/Failure */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Edit Work Order Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Work Order</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Title"
              name="title"
              value={selectedWorkOrder?.title || ""}
              onChange={handleEditChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Display Name"
              name="displayName"
              value={selectedWorkOrder?.displayName || ""}
              onChange={handleEditChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              value={selectedWorkOrder?.description || ""}
              onChange={handleEditChange}
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Start Date"
              type="date"
              name="startDate"
              value={selectedWorkOrder?.startDate || ""}
              onChange={handleEditChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Due Date"
              type="date"
              name="dueDate"
              value={selectedWorkOrder?.dueDate || ""}
              onChange={handleEditChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Priority"
              name="priority"
              value={selectedWorkOrder?.priority || ""}
              onChange={handleEditChange}
              select
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              label="Category"
              name="category"
              value={selectedWorkOrder?.category || ""}
              onChange={handleEditChange}
              select
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
            <TextField
              fullWidth
              margin="normal"
              label="Location"
              name="location"
              value={selectedWorkOrder?.location || ""}
              onChange={handleEditChange}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={() => setConfirmationDialogOpen(true)}
              color="primary"
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000} // Time the Snackbar will be shown
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity} // 'success' or 'error'
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* View Work Order Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
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
                  {selectedWorkOrder?.orderStatus || "Not Available"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Team:
                </Typography>
                <Typography variant="body1">
                  {selectedWorkOrder?.team?.name || "N/A"}
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
              onClick={() => setViewDialogOpen(false)}
              sx={{ width: "100%", maxWidth: "200px" }}
            >
              Close
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenApprovalDialog(true)}
              sx={{ width: "100%", maxWidth: "200px" }}
              disabled={selectedWorkOrder?.approvalStatus !== "Approved"} // Disable if the status isn't 'Approved'
            >
              Update Status
            </Button>

            {/* Approval Status Update Dialog */}
            <Dialog
              open={openApprovalDialog}
              onClose={closeApprovalStatusDialog}
            >
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogContent>
                <FormControl fullWidth>
                  <InputLabel>Order Status</InputLabel>
                  <Select
                    value={newApprovalStatus || selectedWorkOrder?.orderStatus}
                    onChange={(e) => setNewApprovalStatus(e.target.value)}
                    label="Order Status"
                  >
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="On Hold">On Hold</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
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

            {selectedWorkOrder?.orderStatus === "Completed" && (
              <Button
                variant="contained"
                color="success"
                onClick={handleMarkAsCompleted}
                sx={{ width: "100%", maxWidth: "200px" }}
              >
                Mark as Completed
              </Button>
            )}

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={() => setSnackbarOpen(false)}
              message={snackbarMessage}
              severity={snackbarSeverity}
            />
          </DialogActions>
        </Dialog>

        {/* Table for displaying work orders */}
        <TableContainer
          component={Paper}
          className="table-container shadow-xl rounded-xl mt-5 mb-5 p-8"
          sx={{ overflowX: "auto" }} // Horizontal scroll added
        >
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100 text-gray-700 font-semibold text-center">
                <TableCell className="font-semibold py-4 px-8">S.No</TableCell>
                <TableCell className="font-semibold py-4 px-8">Title</TableCell>
                <TableCell className="font-semibold py-4 px-8">
                  Display Name
                </TableCell>
                <TableCell className="font-semibold py-4 px-8">
                  Description
                </TableCell>
                <TableCell className="font-semibold py-4 px-8">
                  Start Date
                </TableCell>
                <TableCell className="font-semibold py-4 px-8">
                  Due Date
                </TableCell>
                <TableCell className="font-semibold py-4 px-8">
                  Priority
                </TableCell>
                <TableCell className="font-semibold py-4 px-8">
                  Category
                </TableCell>
                <TableCell className="font-semibold py-4 px-8">
                  Location
                </TableCell>
                <TableCell className="font-semibold py-4 px-8">Asset</TableCell>
                <TableCell className="font-semibold py-4 px-8">
                  Worker
                </TableCell>
                <TableCell className="font-semibold py-4 px-8">Team</TableCell>
                <TableCell className="font-semibold py-4 px-8">
                  Approval Status
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
              {workOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={15}
                    align="center"
                    className="no-data py-6"
                  >
                    No work orders available.
                  </TableCell>
                </TableRow>
              ) : (
                workOrders.map((order, index) => (
                  <TableRow
                    key={order._id}
                    className="hover:bg-gray-50 transition-all table-row"
                    style={{ height: "70px" }} // Increased row height
                  >
                    <TableCell className="px-8 py-4 text-center font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-8 py-4 font-medium">
                      {order.title}
                    </TableCell>
                    <TableCell className="px-8 py-4 font-medium">
                      {order.displayName}
                    </TableCell>
                    <TableCell className="px-8 py-4 font-medium">
                      {order.description}
                    </TableCell>
                    <TableCell className="px-8 py-4 font-medium">
                      {new Date(order.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-8 py-4 font-medium">
                      {order.dueDate
                        ? new Date(order.dueDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="px-8 py-4 font-medium">
                      {order.priority || "N/A"}
                    </TableCell>
                    <TableCell className="px-8 py-4 font-medium">
                      {order.category || "N/A"}
                    </TableCell>
                    <TableCell className="px-8 py-4 font-medium">
                      {order.location || "N/A"}
                    </TableCell>
                    <TableCell className="px-8 py-4 font-medium">
                      {order.asset ? order.asset.name : "N/A"}
                    </TableCell>
                    <TableCell className="px-8 py-4 font-medium">
                      {order.worker?.fullName || "N/A"}
                    </TableCell>
                    <TableCell className="px-8 py-4 font-medium">
                      {order?.team?.name || "N/A"}
                    </TableCell>
                    <TableCell className="px-8 py-4 font-medium">
                      {order.approvalStatus}
                    </TableCell>
                    <TableCell className="px-8 py-4 font-medium">
                      {order.orderStatus}
                    </TableCell>
                    <TableCell className="px-8 py-4">
                      <div className="flex justify-center gap-10">
                        {" "}
                        {/* Increased gap between buttons */}
                        {/* Edit Icon */}
                        {isAdminOrManager && (
                          <EditIcon
                            className="cursor-pointer text-blue-500"
                            sx={{ fontSize: 24 }}
                            onClick={() => handleEditClick(order)}
                          />
                        )}
                        {/* View Icon */}
                        <VisibilityIcon
                          className="cursor-pointer text-blue-500"
                          sx={{ fontSize: 24 }}
                          onClick={() => handleViewClick(order)}
                        />
                        {/* Delete Icon */}
                        {isAdminOrManager && (
                          <DeleteIcon
                            className="cursor-pointer text-red-500"
                            sx={{ fontSize: 24 }}
                            onClick={() => handleDeleteDialogOpen(order._id)}
                          />
                        )}
                      </div>

                      {/* Edit Confirmation Dialog */}
                      <Dialog
                        open={confirmationDialogOpen}
                        onClose={() => setConfirmationDialogOpen(false)}
                      >
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogActions>
                          <Button
                            onClick={() => setConfirmationDialogOpen(false)}
                            color="secondary"
                          >
                            No
                          </Button>
                          <Button
                            onClick={handleUpdateWorkOrder}
                            color="primary"
                          >
                            Yes
                          </Button>
                        </DialogActions>
                      </Dialog>

                      {/* Delete Confirmation Dialog */}
                      <Dialog
                        open={deleteConfirmationDialog}
                        onClose={handleDeleteDialogClose}
                      >
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogActions>
                          <Button
                            onClick={handleDeleteDialogClose}
                            color="secondary"
                          >
                            No
                          </Button>
                          <Button
                            onClick={handleDeleteWorkOrder}
                            color="primary"
                          >
                            Yes
                          </Button>
                        </DialogActions>
                      </Dialog>
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
            count={workOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="pagination-container"
          />
        </TableContainer>

        {/* Snackbar for notifications */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default WorkOrdersManagementPage;
