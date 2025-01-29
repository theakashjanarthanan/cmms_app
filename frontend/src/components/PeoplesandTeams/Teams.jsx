// frontend\src\components\PeoplesandTeams\Teams.jsx

import React, { useState, useEffect } from "react";
import { format } from "date-fns";

import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TablePagination,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  createTeam,
  fetchTeams,
  fetchUsers,
  updateTeam,
  deleteTeam,
} from "../../api/api";

import ViewTeamDialog from "../PeoplesandTeams/ViewTeamDialog";

const Teams = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openWorkersDialog, setOpenWorkersDialog] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [workersText, setWorkersText] = useState("");
  const [teams, setTeams] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Handle opening and closing dialogs
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleOpenWorkersDialog = () => setOpenWorkersDialog(true);
  const handleCloseWorkersDialog = () => setOpenWorkersDialog(false);

  // Fetch users when component mounts
  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    // Fetch teams when the component mounts
    const getTeamsData = async () => {
      try {
        const teamsData = await fetchTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };
    getTeamsData();
  }, []);

  // Handle selecting and deselecting workers
  const handleWorkerSelection = (userId) => {
    setSelectedWorkers((prevSelectedWorkers) =>
      prevSelectedWorkers.includes(userId)
        ? prevSelectedWorkers.filter((id) => id !== userId)
        : [...prevSelectedWorkers, userId],
    );
  };

  // Handle selecting workers and setting the text in the main dialog
  const handleDoneWorkers = () => {
    const selectedNames = users
      .filter((user) => selectedWorkers.includes(user._id))
      .map((user) => user.fullName)
      .join(", ");
    setWorkersText(selectedNames);
    setOpenWorkersDialog(false);
  };

  const handleCreateTeam = async () => {
    if (teamName && teamDescription) {
      const teamData = {
        name: teamName,
        description: teamDescription,
        workers: selectedWorkers,
      };

      try {
        const response = await createTeam(teamData);
        console.log("Team created:", response.message);

        // Show success snackbar
        setSnackbarMessage("Team created successfully");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        setTeamName("");
        setTeamDescription("");
        setSelectedWorkers([]);
        setWorkersText("");
        setOpenDialog(false);

        // Refresh the teams after creating a new team
        const teamsData = await fetchTeams();
        setTeams(teamsData);
      } catch (error) {
        console.error("Error creating team:", error);

        // Show error snackbar
        setSnackbarMessage("Failed to create team");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } else {
      // Show validation error snackbar
      setSnackbarMessage("Please fill in both Name and Description");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    }
  };

  // Handle opening the ViewTeamDialog with the selected team
  const handleViewTeam = (team) => {
    setSelectedTeam(team); // Set the team to be viewed
    setOpenViewDialog(true); // Open the ViewTeamDialog
  };

  // Close the ViewTeamDialog
  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedTeam(null); // Clear selected team
  };

  // Update Team
  const handleUpdateTeam = async () => {
    const teamData = {
      teamId: selectedTeam._id,
      name: teamName,
      description: teamDescription,
      workers: selectedWorkers,
    };

    try {
      console.log(`Updating team with ID: ${selectedTeam._id}...`);
      console.log(`Updated data:`, teamData);

      // Call API to update the team
      const response = await updateTeam(teamData);
      console.log("Team updated successfully:", response.message);

      // Show success Snackbar
      setSnackbarMessage(`Team "${teamName}" updated successfully.`);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Refresh the teams list
      const updatedTeams = await fetchTeams();
      setTeams(updatedTeams);

      setOpenEditDialog(false);
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error(`Error updating team with ID: ${selectedTeam._id}`, error);

      // Show error Snackbar
      setSnackbarMessage(
        `Failed to update team "${teamName}". Please try again.`,
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Open the Edit Dialog with team details
  const handleOpenEditDialog = (team) => {
    setSelectedTeam(team);
    setTeamName(team.name);
    setTeamDescription(team.description);

    // Extract worker IDs and names
    setSelectedWorkers(team.workers.map((worker) => worker._id));
    setWorkersText(team.workers.map((worker) => worker.fullName).join(", "));

    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => setOpenEditDialog(false);

  const closeConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  const handleDeleteTeam = async () => {
    if (selectedTeam) {
      try {
        console.log(`Attempting to delete team with ID: ${selectedTeam._id}`);

        // Call delete API
        const response = await deleteTeam(selectedTeam._id);
        console.log(`Response from server: ${response.message}`);

        // Show success Snackbar
        setSnackbarMessage(`Team "${selectedTeam.name}" deleted successfully.`);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        console.log(`Successfully deleted team: ${selectedTeam.name}`);

        // Remove the deleted team from the state
        setTeams((prevTeams) =>
          prevTeams.filter((team) => team._id !== selectedTeam._id),
        );

        handleCloseDeleteDialog(); // Close the dialog after deletion
      } catch (error) {
        console.error(
          `Error occurred while deleting team with ID: ${selectedTeam._id}`,
          error,
        );

        // Show error Snackbar
        setSnackbarMessage(
          `Failed to delete team "${selectedTeam.name}". Please try again.`,
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } else {
      console.warn("No team selected for deletion.");
      setSnackbarMessage("No team selected for deletion.");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    }
  };

  const handleOpenDeleteDialog = (team) => {
    setSelectedTeam(team);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedTeam(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page is changed
  };

  const paginatedTeams = teams.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <div>

      <br />

      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Add Team
      </Button>

      {/* Add Team Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Team</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Team Name"
            type="text"
            fullWidth
            variant="outlined"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />

          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
          />

          <TextField
            margin="dense"
            label="Workers"
            type="text"
            fullWidth
            variant="outlined"
            value={workersText}
            onClick={handleOpenWorkersDialog}
            InputProps={{ readOnly: true }}
          />

          {/* Workers Selection Dialog */}
          <Dialog
            open={openWorkersDialog}
            onClose={handleCloseWorkersDialog}
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
                    {users.map((user, index) => (
                      <TableRow key={user._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color={
                              selectedWorkers.includes(user._id)
                                ? "secondary"
                                : "primary"
                            }
                            onClick={() => handleWorkerSelection(user._id)}
                          >
                            {selectedWorkers.includes(user._id)
                              ? "Deselect"
                              : "Select"}
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
                onClick={handleCloseWorkersDialog}
                variant="contained"
                color="secondary"
              >
                Close
              </Button>
              <Button
                onClick={handleDoneWorkers}
                variant="contained"
                color="primary"
              >
                Done
              </Button>
            </DialogActions>
          </Dialog>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateTeam} color="primary">
            Create Team
          </Button>
        </DialogActions>
      </Dialog>

      {/* Teams Table */}
      <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>No: Of People</TableCell>
              <TableCell>Team Created</TableCell>
              <TableCell>Team Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTeams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No teams available.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTeams.map((team, index) => (
                <TableRow key={team._id}>
                  <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.numberOfPeople}</TableCell>
                  <TableCell>
                    {team.createdAt
                      ? format(new Date(team.createdAt), "MMMM dd, yyyy 'at' hh:mm:ss a")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {team.updatedAt
                      ? format(new Date(team.updatedAt), "MMMM dd, yyyy 'at' hh:mm:ss a")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewTeam(team)}
                    >
                      View
                    </Button>

                    {/* View Team Dialog */}
                    {selectedTeam && (
                      <ViewTeamDialog // Imported from TeamsComponents.jsx
                        open={openViewDialog}
                        onClose={handleCloseViewDialog}
                        team={selectedTeam}
                      />
                    )}

                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenEditDialog(team)}
                    >
                      Update
                    </Button>

                    {/* Edit Team Dialog */}
                    <Dialog
                      open={openEditDialog}
                      onClose={handleCloseEditDialog}
                    >
                      <DialogTitle>Edit Team</DialogTitle>
                      <DialogContent>
                        <TextField
                          label="Team Name"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          fullWidth
                          margin="normal"
                        />

                        <TextField
                          label="Description"
                          value={teamDescription}
                          onChange={(e) => setTeamDescription(e.target.value)}
                          fullWidth
                          margin="normal"
                          multiline
                          rows={4}
                        />

                        <TextField
                          label="Workers"
                          value={workersText}
                          onClick={handleOpenWorkersDialog}
                          fullWidth
                          InputProps={{ readOnly: true }}
                          margin="normal"
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={handleCloseEditDialog}
                          color="secondary"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => setConfirmDialogOpen(true)}
                          color="primary"
                        >
                          Update
                        </Button>
                      </DialogActions>
                    </Dialog>

                    {/* Update Confirmation Dialog */}
                    <Dialog
                      open={confirmDialogOpen}
                      onClose={closeConfirmDialog}
                    >
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogContent>
                        <Typography>
                          Do you really want to update this team?
                        </Typography>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={closeConfirmDialog} color="secondary">
                          No
                        </Button>
                        <Button onClick={handleUpdateTeam} color="primary">
                          Yes
                        </Button>
                      </DialogActions>
                    </Dialog>

                    <Button
                      onClick={() => handleOpenDeleteDialog(team)}
                      color="error"
                      variant="contained"
                    >
                      Delete
                    </Button>

                    {/* Delete Confirmation Dialog */}
                    <Dialog
                      open={openDeleteDialog}
                      onClose={handleCloseDeleteDialog}
                    >
                      <DialogTitle>
                        Are you sure you want to delete this team?
                      </DialogTitle>
                      <DialogContent>
                        <p>This action cannot be undone.</p>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={handleCloseDeleteDialog}
                          color="primary"
                        >
                          No
                        </Button>
                        <Button onClick={handleDeleteTeam} color="error">
                          Yes, Delete
                        </Button>
                      </DialogActions>
                    </Dialog>

                    {/* Snackbar Notifications */}
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
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Table Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]} // Options for number of rows per page
        component="div"
        count={teams.length} // Total number of teams
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage} // Update page number
        onRowsPerPageChange={handleChangeRowsPerPage} // Update rows per page
        labelRowsPerPage="Rows per page" // Custom label for rows per page dropdown
        // Limiting maximum pages to 10
        SelectProps={{
          inputProps: { "aria-label": "rows per page" },
          native: true,
        }}
      />
    </div>
  );
};

export default Teams;
