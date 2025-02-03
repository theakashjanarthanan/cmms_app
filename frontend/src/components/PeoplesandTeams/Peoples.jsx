// frontend\src\components\PeoplesandTeams\Peoples.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TablePagination,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Snackbar,
  Alert,
  Grid,
  IconButton
} from "@mui/material";

import { format } from "date-fns";
import API from "../../api/api";
import { Add as AddIcon } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

const Peoples = ({ openAddDialog, handleCloseAddDialog, searchTerm }) => {
  const [users, setUsers] = useState([]); // Users for table
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for editing
  const [openEditDialog, setOpenEditDialog] = useState(false); // State for Edit Dialog
  const [role, setRole] = useState(""); // User role to be changed
  const [page, setPage] = useState(0); // Pagination page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const [confirmOpen, setConfirmOpen] = useState(false); // State for confirmation dialog
  const [selectedUserId, setSelectedUserId] = useState(null); // To store user ID for delete
  const [message, setMessage] = useState(""); // To store success or error message
  const [messageType, setMessageType] = useState(""); // To track message type ('success' or 'error')
  const [messageDialogOpen, setMessageDialogOpen] = useState(false); // To show message dialog
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error'
  const [selectedRole, setSelectedRole] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);


  // Add User functionality

  const [newUsers, setNewUsers] = useState([
    { fullName: "", email: "", password: "", role: "Guest" },
  ]);

  const roles = [
    "Admin",
    "Requestor",
    "Technician",
    "Guest",
  ]; // Available roles

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get("/auth/users");
        const sortedUsers = data.sort((a, b) => (a._id < b._id ? 1 : -1));
        setUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Handle the Add User dialog open/close
  // const handleOpenAddDialog = () => {
  //   setOpenAddDialog(true);
  // };

  // const handleCloseAddDialog = () => {
  //   setOpenAddDialog(false);
  //   setNewUsers([{ fullName: "", email: "", password: "", role: "Guest" }]); // Reset form
  // };

  // Handle the form field changes for Add User
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedUsers = [...newUsers];
    updatedUsers[index][name] = value;
    setNewUsers(updatedUsers);
  };

  // Add another user form
  const handleAddAnotherUser = () => {
    setNewUsers([
      ...newUsers,
      { fullName: "", email: "", password: "", role: "Guest" },
    ]);
  };

  // Handle adding users functionality
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false); // Confirmation dialog state
  const [isAddingUsers, setIsAddingUsers] = useState(false); // To track loading state during adding users

  const handleAddUsers = async () => {
    setOpenConfirmationDialog(true); // Open the confirmation dialog
  };

  const handleConfirmAddUsers = async () => {
    setIsAddingUsers(true); // Show loading state
    try {
      // Send data to backend for each user
      await Promise.all(
        newUsers.map(async (user) => {
          const response = await API.post("/auth/register", user);
          return response.data;
        }),
      );

      setSnackbarMessage("Users added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true); // Open the Snackbar
      setUsers((prev) => [...prev, ...newUsers]); // Add new users to the list
      handleCloseAddDialog(); // Close the add dialog
    } catch (error) {
      console.error("Error adding users:", error);
      setSnackbarMessage("Failed to add users. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true); // Open the Snackbar
    } finally {
      setIsAddingUsers(false);
      setOpenConfirmationDialog(false); // Close the confirmation dialog
    }
  };

  const handleCancelAddUsers = () => {
    setOpenConfirmationDialog(false); // Close the confirmation dialog
  };

  // Open Edit User dialog
  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setRole(user.role); // Set the initial role for editing
    setOpenEditDialog(true);
  };

  // Close Edit User dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedUser(null);
  };

  // Handle the role change submission
  const handleRoleChange = async () => {
    try {
      // Update the user’s role in the backend
      await API.put(`/auth/users/${selectedUser._id}/assign-role`, {
        role,
      });

      // Update the UI with the new user role
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, role } : user,
        ),
      );
      setMessage("Role updated successfully!");
      setMessageType("success");
    } catch (error) {
      console.error("Error updating user role:", error);
      setMessage("Failed to update role. Please try again.");
      setMessageType("error");
    } finally {
      setMessageDialogOpen(true);
      handleCloseEditDialog(); // Close the edit dialog after success
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open the confirmation dialog for delete
  const handleOpenConfirmDialog = (userId) => {
    setSelectedUserId(userId);
    setConfirmOpen(true);
  };

  // Confirm delete action
  const handleConfirmDelete = async () => {
    try {
      // API call to delete the user
      await API.delete(`/auth/users/${selectedUserId}`);
      setUsers((prev) => prev.filter((user) => user._id !== selectedUserId));

      // Set success message for Snackbar
      setSnackbarMessage("User deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true); // Show Snackbar
    } catch (error) {
      console.error("Error deleting user:", error);

      // Set error message for Snackbar
      setSnackbarMessage("Failed to delete user. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true); // Show Snackbar
    } finally {
      setConfirmOpen(false); // Close confirmation dialog
    }
  };

  // Function to handle the deletion of the last user added
  const handleDeleteLastUser = () => {
    if (newUsers.length > 1) {
      const updatedUsers = [...newUsers];
      updatedUsers.pop(); // Remove the last user from the list
      setNewUsers(updatedUsers); // Update the state with the new list
    }
  };

  // Search Functionality
  const filteredUsers = users.filter(
    (user) =>
      (selectedRole ? user.role.toLowerCase() === selectedRole.toLowerCase() : true) &&
      (user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Open dropdown menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close dropdown menu
  const handleClose = () => {
    setAnchorEl(null);
  };

    // Handle option selection
    const handleSelectOption = (role) => {
      setSelectedRole(role);
      handleClose();
    };

  return (
    <div>
      <br />

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

      {/* Account Type Filter */}
      <Button
        className="button sc-bYSBpT eAuzXa"
        type="button"
        onClick={handleClick}
        style={{ marginRight: "auto", marginLeft: "10px", gap: "10px" }}
      >
        <div className="icon-outer icon-before sc-dnqmqq bAdjVm">
          <div className="icon icon-controls icon-before sc-kAzzGY gZSYFh sc-bxivhb eykofB" fill="black" strokeWidth="0">
            <svg width="16" height="16" viewBox="0 0 24 24.001" xmlns="http://www.w3.org/2000/svg" fill="black" strokeWidth="0">
              <path fillRule="evenodd" clipRule="evenodd" d="M9 7a1 1 0 100 2 1 1 0 000-2zM6 8a3 3 0 116 0 3 3 0 01-6 0z"></path>
              <path fillRule="evenodd" clipRule="evenodd" d="M2 8a1 1 0 011-1h4a1 1 0 010 2H3a1 1 0 01-1-1zM10 8a1 1 0 011-1h10a1 1 0 110 2H11a1 1 0 01-1-1zM15 15a1 1 0 100 2 1 1 0 000-2zm-3 1a3 3 0 116 0 3 3 0 01-6 0z"></path>
              <path fillRule="evenodd" clipRule="evenodd" d="M2 16a1 1 0 011-1h10a1 1 0 110 2H3a1 1 0 01-1-1zM16 16a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z"></path>
            </svg>
          </div>
        </div>

        <span className="sc-jDwBTQ emnDFx sc-jAaTju cSYAxM sc-eNQAEJ gLwsew" dataFor="false">
         {selectedRole || "Account Type"} 
        </span>

        <div className="icon-outer icon-after sc-dnqmqq bAdjVm">
          <div className="icon icon-chevronDown icon-after sc-kAzzGY gpxkJv sc-bxivhb eykofB" strokeWidth="0">
            <svg viewBox="0 -1 24 24" xmlns="http://www.w3.org/2000/svg" width="16" height="16" strokeWidth="0">
              <path fillRule="evenodd" clipRule="evenodd" d="M18.707 8.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 011.414-1.414L12 13.586l5.293-5.293a1 1 0 011.414 0z"></path>
            </svg>
          </div>
        </div>
      </Button>

      {/* Account Type Dropdown Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleSelectOption("Admin")}>Admin</MenuItem>
        <MenuItem onClick={() => handleSelectOption("Requestor")}>Requestor</MenuItem>
        <MenuItem onClick={() => handleSelectOption("Technician")}>Technician</MenuItem>
        <MenuItem onClick={() => handleSelectOption("Guest")}>Guest</MenuItem>
      </Menu>

      {/* Users Table */}
      <TableContainer
        component={Paper}
        className="table-container shadow-xl rounded-xl mt-5 mb-5 p-6"
      >
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100 text-gray-700 font-semibold text-center">
              <TableCell className="font-semibold">S. No.</TableCell>
              <TableCell className="font-semibold">Name</TableCell>
              <TableCell className="font-semibold">Email</TableCell>
              <TableCell className="font-semibold">Role</TableCell>
              <TableCell className="font-semibold">Date Created</TableCell>
              <TableCell className="font-semibold">Last Login</TableCell>
              <TableCell className="font-semibold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" className="no-data">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => (
                  <TableRow
                    key={user._id}
                    className="hover:bg-gray-50 transition-all table-row"
                  >
                    <TableCell className="px-4 py-3 text-center font-medium">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium">
                      {user.fullName}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium">
                      {user.role}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium">
                      {user.dateCreated
                        ? format(new Date(user.dateCreated), "MMMM dd, yyyy 'at' hh:mm:ss a")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-medium">
                      {user.lastLogin
                        ? format(new Date(user.lastLogin), "MMMM dd, yyyy 'at' hh:mm:ss a")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex justify-center gap-6">
                        <EditIcon
                          className="action-icon edit-icon"
                          onClick={() => handleOpenEditDialog(user)}
                        />
                        <DeleteIcon
                          className="action-icon delete-icon"
                          onClick={() => handleOpenConfirmDialog(user._id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="pagination-container"
      />

      {/* Edit User Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Typography variant="h6">
            Full Name: {selectedUser?.fullName}
          </Typography>
          <Typography variant="h6">
            Email: {selectedUser?.email}
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Role"
            >
              {roles.map((roleOption) => (
                <MenuItem key={roleOption} value={roleOption}>
                  {roleOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseEditDialog}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRoleChange}
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deleting */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-delete-dialog"
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        fullWidth
      >

        <DialogTitle style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Open Sans', system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
          fontSize: "24px",
        }}>
          Add User
          <Button
            onClick={handleCloseAddDialog}
            color="primary"
            style={{
              position: "absolute",
              minWidth: "auto",
              padding: 0,
              marginTop: "5px",
              left: "550px",
              color: "black"
            }}
          >
            <CloseIcon />
          </Button>
        </DialogTitle>
        <Divider
          orientation="vertical"
          style={{
            height: "1px",  // Set the height of the divider to match the dialog title's height
            backgroundColor: "rgb(184, 184, 184)"  // Light color for the divider
          }}
        />
        <DialogContent>
          {newUsers.map((user, index) => (
            <Box key={index}>

              <TextField
                label="Full Name"
                name="fullName"
                value={user.fullName}
                onChange={(e) => handleInputChange(index, e)}
                fullWidth
                margin="normal"
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    value={user.email}
                    onChange={(e) => handleInputChange(index, e)}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={user.role}
                      name="role"
                      onChange={(e) => handleInputChange(index, e)}
                      label="Role"
                    >
                      {roles.map((roleOption) => (
                        <MenuItem key={roleOption} value={roleOption}>
                          {roleOption}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <TextField
                label="Password"
                name="password"
                type="password"
                value={user.password}
                onChange={(e) => handleInputChange(index, e)}
                fullWidth
                margin="normal"
              />
            </Box>
          ))}

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button
              variant="outlined"
              color="white"
              onClick={handleAddAnotherUser}
              startIcon={<AddIcon />}
              style={{ border: "1px solid rgb(184, 184, 184)", marginTop: "20px" }}
            >
              Add Another User
            </Button>

            {/* Delete Last User Button */}
            {newUsers.length > 1 && (
              <IconButton
                color="secondary"
                onClick={handleDeleteLastUser}
                style={{ marginLeft: '10px', color: "rgb(224, 30, 90", marginTop: "20px" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="red" xmlns="http://www.w3.org/2000/svg" stroke-width="0">
                  <path clip-rule="evenodd" d="M9.293 4.293A1 1 0 0110 4h4a1 1 0 011 1v1H9V5a1 1 0 01.293-.707zM7 6V5a3 3 0 013-3h4a3 3 0 013 3v1h3a1 1 0 110 2h-1v11a3 3 0 01-3 3H8a3 3 0 01-3-3V8H4a1 1 0 010-2h3zm0 2v11a1 1 0 001 1h8a1 1 0 001-1V8H7z"></path>
                </svg>
              </IconButton>
            )}

          </Box>
        </DialogContent>
        <Divider
          orientation="vertical"
          style={{
            height: "1px",  // Set the height of the divider to match the dialog title's height
            backgroundColor: "rgb(184, 184, 184)"  // Light color for the divider
          }}
        />
        <DialogActions style={{ gap: "10px", marginRight: "30px", marginTop: "15px" }} >
          <Button
            onClick={handleCloseAddDialog}
            color="white"
            variant="outlined"
            startIcon={<CloseIcon />}
            style={{
              border: "1px solid rgb(184, 184, 184)",
              fontSize: "16px",
              marginBottom: "20px",
              textTransform: "none",
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI (Custom)", Roboto, "Helvetica Neue", "Open Sans (Custom)", system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddUsers}
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
            style={{
              marginBottom: "20px",
              fontSize: "16px",
              textTransform: "none",
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI (Custom)", Roboto, "Helvetica Neue", "Open Sans (Custom)", system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
            }}
          >
            Add Users
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Adding Users */}
      <Dialog
        open={openConfirmationDialog}
        onClose={handleCancelAddUsers}
      >
        <DialogTitle >
          {isAddingUsers ? (
            <div >
              <CircularProgress size={20} />
              Adding...
            </div>
          ) : (
            <div>
              <WarningIcon />
              {`Are you sure you want to add ${newUsers.length} users?`}
            </div>
          )}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={handleCancelAddUsers}
          >
            <CloseIcon />
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAddUsers}
            disabled={isAddingUsers}
          >
            <CheckIcon />
            {isAddingUsers ? "Adding..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog */}
      <Dialog
        open={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
      >
        <DialogTitle>
          {messageType === "success" ? "Success" : "Error"}
        </DialogTitle>
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default Peoples;
