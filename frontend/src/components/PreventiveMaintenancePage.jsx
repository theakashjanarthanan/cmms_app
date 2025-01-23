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
} from "../api/api";  

import PreventiveMaintenanceTable from './PreventiveMaintenanceDialogs/PreventiveMaintenanceTable';                 // Table Component
import PreventiveMaintenanceViewDialog from './PreventiveMaintenanceDialogs/PreventiveMaintenanceViewDialog';       // View Dialog Component
import PreventiveMaintenanceEditDialog from './PreventiveMaintenanceDialogs/PreventiveMaintenanceEditDialog';       // Create Dialog Component
import PreventiveMaintenanceDeleteDialog from './PreventiveMaintenanceDialogs/PreventiveMaintenanceDeleteDialog';   // Delete Dialog Component

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

        
        <Box sx={{ width: "100%", marginTop: 4 }}>
          
          {/* Table Displaying Preventive Maintenance Records */}
          <>
          <PreventiveMaintenanceTable
            sortedPMs={sortedPMs}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleViewClick={handleViewClick}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            pms={pms}
          />
          </>
          
          {/* View PM Dialog */}
          <>
          <PreventiveMaintenanceViewDialog
            open={openViewDialog}
            handleClose={handleCloseViewDialog}
            pmDetails={pmDetails}
          />
          </>

          {/* Edit Dialog */}
          <>
          <PreventiveMaintenanceEditDialog
            open={openEditDialog}
            handleCloseDialog={handleCloseDialog}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
          </>

          {/* Delete Confirmation Dialog */}
          <>
          <PreventiveMaintenanceDeleteDialog
            open={openDeleteDialog}
            handleDeleteCancel={handleDeleteCancel}
            handleDeleteConfirm={handleDeleteConfirm}
          />
          </>

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
