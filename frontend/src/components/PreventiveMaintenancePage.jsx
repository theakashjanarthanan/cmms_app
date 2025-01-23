// frontend\src\components\PreventiveMaintenancePage.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  Table,
  TableContainer,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  TablePagination,
  Snackbar,
  Alert,
} from "@mui/material";
import Sidebar from "./Sidebar";
import {
  createPM,
  fetchAssets,
  fetchTeams,
  fetchActiveTechnicians,
  fetchAllPMs,
  fetchPMById,
  updatePM,
  deletePM,
} from "../api/api"; // Assuming these API functions exist

// Icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const PreventiveMaintenancePage = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [assetsForm, setAssetsForm] = useState({
    asset: "",
    location: "",
    startDate: "",
    dueDate: "",
    worker: "",
    team: "",
  });
  const [workOrderForm, setWorkOrderForm] = useState({
    title: "",
    displayName: "",
    description: "",
    priority: "",
    category: "Preventative",
    status: "",
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Asset Selection
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Worker Selection
  const [workerDialogOpen, setWorkerDialogOpen] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);

  // Teams Selection
  const [teams, setTeams] = useState([]);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // View Dialog
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [pmDetails, setPmDetails] = useState(null);

  // Edit Dialog
  const [formData, setFormData] = useState({
    title: "",
    displayName: "",
    description: "",
    startDate: "",
    dueDate: "",
    priority: "",
    location: "",
    category: "",
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedPM, setSelectedPM] = useState(null);

  // Delete Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPMId, setSelectedPMId] = useState(null);
  const [pmList, setPmList] = useState([]);

  // Display Table
  const [pms, setPms] = useState([]);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Snackbar Notification
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch all necessary data (PMs, assets, teams, technicians) when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all required data
        const fetchedPMs = await fetchAllPMs();
        const fetchedAssets = await fetchAssets();
        const fetchedTeams = await fetchTeams();
        const fetchedTechnicians = await fetchActiveTechnicians();

        // Set all the states
        setPms(fetchedPMs);
        setAssets(fetchedAssets);
        setTeams(fetchedTeams);
        setTechnicians(fetchedTechnicians);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        alert("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, []);

  const handleDialogClose = () => {
    setOpenDialog(false);
    setActiveTab(0);
    setAssetsForm({
      asset: "",
      location: "",
      startDate: "",
      dueDate: "",
      worker: "",
      team: "",
    });
    setWorkOrderForm({
      title: "",
      displayName: "",
      description: "",
      priority: "",
      category: "Preventative",
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNextClick = () => {
    if (activeTab === 0) {
      setActiveTab(1); // Move to Work Order tab
    }
  };

  const handleCreatePMClick = async () => {
    setConfirmDialogOpen(true);
  };

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
    setAssetsForm((prev) => ({
      ...prev,
      asset: asset._id,
    }));
    setAssetDialogOpen(false);
  };

  const handleSelectWorker = (worker) => {
    setSelectedWorker(worker);
    setAssetsForm((prev) => ({
      ...prev,
      worker: worker._id,
    }));
    setWorkerDialogOpen(false);
  };

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
    setAssetsForm((prev) => ({
      ...prev,
      team: team._id,
    }));
    setTeamDialogOpen(false);
  };

  const handleConfirmDialogClose = async (confirmed) => {
    setConfirmDialogOpen(false);
    if (confirmed) {
      // Prepare the data for submission
      const pmData = {
        asset: assetsForm.asset,
        location: assetsForm.location,
        startDate: assetsForm.startDate,
        dueDate: assetsForm.dueDate,
        worker: assetsForm.worker,
        team: assetsForm.team,
        title: workOrderForm.title,
        displayName: workOrderForm.displayName,
        description: workOrderForm.description,
        priority: workOrderForm.priority,
        category: workOrderForm.category,
        status: workOrderForm.status,
      };

      try {
        // Call the backend API to create the PM
        await createPM(pmData);
        console.log("Preventive Maintenance created successfully!");

        // Set success snackbar message
        setSnackbarMessage("Preventive Maintenance created successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        handleDialogClose();
      } catch (error) {
        console.error("Error:", error);

        // Set error snackbar message
        setSnackbarMessage("Failed to create Preventive Maintenance.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  // Sorting the PMs by the created date, most recent first
  const sortedPMs = pms.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  // Handling page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handling rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page change
  };

  // View Dialog Functionality
  const handleViewClick = async (pmId) => {
    try {
      const pmData = await fetchPMById(pmId);
      setPmDetails(pmData);
      setOpenViewDialog(true);
    } catch (error) {
      console.error("Error fetching Preventive Maintenance details:", error);
    }
  };

  // Close the view dialog
  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setPmDetails(null);
  };

  // Edit Functionality
  const handleEditClick = (pm) => {
    setSelectedPM(pm);
    setFormData({
      title: pm.title,
      displayName: pm.displayName,
      description: pm.description,
      startDate: pm.startDate,
      dueDate: pm.dueDate,
      priority: pm.priority,
      location: pm.location,
      category: pm.category,
      status: pm.status,
    });
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setFormData({
      title: "",
      displayName: "",
      description: "",
      startDate: "",
      dueDate: "",
      priority: "",
      location: "",
      category: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await updatePM(selectedPM._id, formData); // Use the update API call
      console.log("Preventive Maintenance updated successfully!");

      setOpenSnackbar(true);
      setSnackbarMessage("Preventive Maintenance updated successfully!");
      setSnackbarSeverity("success");

      setOpenEditDialog(false); // Close edit dialog
      setFormData({
        title: "",
        displayName: "",
        description: "",
        startDate: "",
        dueDate: "",
        priority: "",
        location: "",
        category: "",
      });

      const updatedPMs = await fetchAllPMs();
      setPms(updatedPMs); // Assuming setPms is used to update the state with the new PM list
    } catch (error) {
      console.error("Error updating PM:", error);

      setSnackbarMessage("Failed to update Preventive Maintenance.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Delete Functionality
  // Handle delete confirmation
  const handleDeleteClick = (pmId) => {
    setSelectedPMId(pmId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePM(selectedPMId); // Call to delete the PM from the backend
      console.log("Preventive Maintenance deleted successfully!");

      setOpenSnackbar(true);
      setSnackbarMessage("Preventive Maintenance deleted successfully!");
      setSnackbarSeverity("success");

      setPmList(pmList.filter((pm) => pm._id !== selectedPMId)); // Remove the deleted PM from the list
      setOpenDeleteDialog(false); // Close the delete dialog
    } catch (error) {
      console.error("Error deleting Preventive Maintenance:", error);

      setSnackbarMessage("Failed to delete Preventive Maintenance.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
    setSelectedPMId(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, ml: "250px", p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Preventive Maintenance Page
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Create PM
        </Button>

        {/* Create PM Dialog Box */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Create Preventive Maintenance</DialogTitle>
          <DialogContent>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="tabs"
            >
              <Tab label="Assets" />
              <Tab label="Work Order" />
            </Tabs>

            {activeTab === 0 && (
              <Box sx={{ mt: 2 }}>
                {/* Asset Selection Input Field */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Asset"
                    value={selectedAsset?.name || ""}
                    onClick={() => setAssetDialogOpen(true)} // Open the Asset Dialog on
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </FormControl>

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
                                <Button
                                  onClick={() => handleSelectAsset(asset)}
                                >
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

                <TextField
                  label="Location"
                  fullWidth
                  value={assetsForm.location}
                  onChange={(e) =>
                    setAssetsForm({ ...assetsForm, location: e.target.value })
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Start Date"
                  type="date"
                  fullWidth
                  value={assetsForm.startDate}
                  onChange={(e) =>
                    setAssetsForm({ ...assetsForm, startDate: e.target.value })
                  }
                  sx={{ mb: 2 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Due Date"
                  type="date"
                  fullWidth
                  value={assetsForm.dueDate}
                  onChange={(e) =>
                    setAssetsForm({ ...assetsForm, dueDate: e.target.value })
                  }
                  sx={{ mb: 2 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                {/* Worker Selection Input */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Worker"
                    value={selectedWorker?.fullName || ""}
                    onClick={() => setWorkerDialogOpen(true)}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </FormControl>

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
                                <Button
                                  onClick={() => handleSelectWorker(tech)}
                                >
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

                {/* Team Selection Input */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Team"
                    value={selectedTeam?.name || ""}
                    onClick={() => setTeamDialogOpen(true)}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </FormControl>

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

                <Button
                  variant="contained"
                  onClick={handleNextClick}
                  disabled={!assetsForm.asset || !assetsForm.location}
                >
                  Next
                </Button>
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Title"
                  fullWidth
                  value={workOrderForm.title}
                  onChange={(e) =>
                    setWorkOrderForm({
                      ...workOrderForm,
                      title: e.target.value,
                    })
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Display Name"
                  fullWidth
                  value={workOrderForm.displayName}
                  onChange={(e) =>
                    setWorkOrderForm({
                      ...workOrderForm,
                      displayName: e.target.value,
                    })
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Description"
                  multiline
                  rows={4}
                  fullWidth
                  value={workOrderForm.description}
                  onChange={(e) =>
                    setWorkOrderForm({
                      ...workOrderForm,
                      description: e.target.value,
                    })
                  }
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={workOrderForm.priority}
                    onChange={(e) =>
                      setWorkOrderForm({
                        ...workOrderForm,
                        priority: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    name="status"
                    value={workOrderForm.status}
                    onChange={(e) =>
                      setWorkOrderForm({
                        ...workOrderForm,
                        status: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="Open">Open</MenuItem>
                    <MenuItem value="On Hold">On Hold</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Converted as Work Order">
                      Converted as Work Order
                    </MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={handleCreatePMClick}
                  disabled={!workOrderForm.title || !workOrderForm.displayName}
                >
                  Create PM
                </Button>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Confirm Dialog */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogActions>
            <Button
              onClick={() => handleConfirmDialogClose(true)}
              color="primary"
            >
              Yes
            </Button>
            <Button
              onClick={() => handleConfirmDialogClose(false)}
              color="secondary"
            >
              No
            </Button>
          </DialogActions>
        </Dialog>

        {/* Table Displaying Preventive Maintenance Records */}
        <Box sx={{ width: "100%", marginTop: 4 }}>
          <TableContainer
            component={Paper}
            className="table-container shadow-xl rounded-xl mt-5 mb-5 p-8"
            sx={{ overflowX: "auto" }} // Horizontal scroll added
          >
            <Table>
              <TableHead>
                <TableRow className="bg-gray-100 text-gray-700 font-semibold text-center">
                  <TableCell className="font-semibold py-4 px-8">
                    S No
                  </TableCell>{" "}
                  {/* Increased padding */}
                  <TableCell className="font-semibold py-4 px-8">
                    Display Name
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    Title
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    Asset Name
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    Asset Location
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    Category
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    Worker
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    Team
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    Priority
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    Date Created
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    Date Updated
                  </TableCell>
                  <TableCell className="font-semibold py-4 px-8">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedPMs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      align="center"
                      className="no-data py-6"
                    >
                      No preventive maintenance records available.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedPMs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((pm, index) => (
                      <TableRow
                        key={pm._id}
                        className="hover:bg-gray-50 transition-all"
                        style={{ height: "70px" }} // Increased row height
                      >
                        <TableCell className="px-8 py-4 text-center font-medium">
                          {index + 1 + page * rowsPerPage}
                        </TableCell>
                        <TableCell className="px-8 py-4 font-medium">
                          {pm.displayName}
                        </TableCell>
                        <TableCell className="px-8 py-4 font-medium">
                          {pm.title}
                        </TableCell>
                        <TableCell className="px-8 py-4 font-medium">
                          {pm.asset.name}
                        </TableCell>
                        <TableCell className="px-8 py-4 font-medium">
                          {pm.location}
                        </TableCell>
                        <TableCell className="px-8 py-4 font-medium">
                          {pm.category}
                        </TableCell>
                        <TableCell className="px-8 py-4 font-medium">
                          {pm.worker.fullName}
                        </TableCell>
                        <TableCell className="px-8 py-4 font-medium">
                          {pm.team.name}
                        </TableCell>
                        <TableCell className="px-8 py-4 font-medium">
                          {pm.priority}
                        </TableCell>
                        <TableCell className="px-8 py-4 font-medium">
                          {new Date(pm.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="px-8 py-4 font-medium">
                          {new Date(pm.updatedAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="px-8 py-4">
                          <div className="flex justify-center gap-10">
                            {" "}
                            {/* Increased gap between icons */}
                            <VisibilityIcon
                              className="action-icon view-icon text-blue-500"
                              sx={{ fontSize: 28 }} // Increased icon size
                              onClick={() => handleViewClick(pm._id)}
                            />
                            <EditIcon
                              className="action-icon edit-icon text-green-500"
                              sx={{ fontSize: 28 }} // Increased icon size
                              onClick={() => handleEditClick(pm)}
                            />
                            <DeleteIcon
                              className="action-icon delete-icon text-red-500"
                              sx={{ fontSize: 28 }} // Increased icon size
                              onClick={() => handleDeleteClick(pm._id)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Table Pagination */}
          <TablePagination
            component="div"
            count={pms.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            className="pagination-container"
          />

          {/* View PM Dialog */}
          <Dialog
            open={openViewDialog}
            onClose={handleCloseViewDialog}
            maxWidth="md" // Set max width to make it look more consistent
            fullWidth
          >
            <DialogTitle>Preventive Maintenance Details</DialogTitle>
            <DialogContent>
              {pmDetails && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Asset:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {pmDetails.asset.name}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Location:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {pmDetails.location}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Start Date:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {new Date(pmDetails.startDate).toLocaleDateString()}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Due Date:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {new Date(pmDetails.dueDate).toLocaleDateString()}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Worker:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {pmDetails.worker.fullName}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Team:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {pmDetails.team.name}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Title:</strong>
                    </Typography>
                    <Typography variant="body2">{pmDetails.title}</Typography>
                  </div>

                  <div>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Display Name:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {pmDetails.displayName}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Description:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {pmDetails.description}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Priority:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {pmDetails.priority}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Category:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {pmDetails.category}
                    </Typography>
                  </div>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseViewDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={openEditDialog} onClose={handleCloseDialog}>
            <DialogTitle>Edit Preventive Maintenance</DialogTitle>
            <DialogContent>
              <TextField
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Display Name"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Start Date"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Due Date"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSubmit} color="primary">
                Done
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogContent>
              <p>Do you want to delete this Preventive Maintenance record?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel} color="primary">
                No
              </Button>
              <Button onClick={handleDeleteConfirm} color="secondary">
                Yes
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
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
      </Box>
    </Box>
  );
};

export default PreventiveMaintenancePage;
