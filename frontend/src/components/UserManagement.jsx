// frontend\src\components\UserManagement.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Snackbar,
  Alert
} from "@mui/material";

import API from "../api/api"; // Ensure the API module is correctly configured
import Sidebar from "./Sidebar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";  


const UserManagement = () => {
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


  // Add User functionality
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newUsers, setNewUsers] = useState([
    { fullName: "", email: "", password: "", role: "Guest" },
  ]);

  const roles = [
    "Admin",
    "Inventory Manager",
    "Manager",
    "Technician",
    "Guest",
    "Requestor"
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
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewUsers([{ fullName: "", email: "", password: "", role: "Guest" }]); // Reset form
  };

  // Handle the form field changes for Add User
  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedUsers = [...newUsers];
    updatedUsers[index][name] = value;
    setNewUsers(updatedUsers);
  };

  // Add another user form
  const handleAddAnotherUser = () => {
    setNewUsers([...newUsers, { fullName: "", email: "", password: "", role: "Guest" }]);
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
        })
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
          user._id === selectedUser._id ? { ...user, role } : user
        )
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


  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, ml: "250px", p: 3 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>

        {/* Add User Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddDialog}
          sx={{ mb: 2 }}
        >
          Add User
        </Button>

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
        <TableCell className="font-semibold">Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {users.length === 0 ? (
        <TableRow>
          <TableCell colSpan={5} align="center" className="no-data">
            No users available.
          </TableCell>
        </TableRow>
      ) : (
        users
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
          count={users.length}
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
            <Typography variant="h6">Full Name: {selectedUser?.fullName}</Typography>
            <Typography variant="h6">Email: {selectedUser?.email}</Typography>
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
            <Button onClick={handleCloseEditDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleRoleChange} color="primary">
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
            <Button
              onClick={handleConfirmDelete}
              color="error"
              autoFocus
            >
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
          <DialogTitle>Add User</DialogTitle>
          <DialogContent>
            {newUsers.map((user, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <TextField
                  label="Full Name"
                  name="fullName"
                  value={user.fullName}
                  onChange={(e) => handleInputChange(index, e)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Email"
                  name="email"
                  value={user.email}
                  onChange={(e) => handleInputChange(index, e)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={user.password}
                  onChange={(e) => handleInputChange(index, e)}
                  fullWidth
                  margin="normal"
                />
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
              </Box>
            ))}
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleAddAnotherUser}
            >
              Add Another User
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddUsers} color="primary">
              Add Users
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog for Adding Users */}
        <Dialog
          open={openConfirmationDialog}
          onClose={handleCancelAddUsers}
        >
          <DialogTitle>
            {isAddingUsers ? "Adding..." : `Are you sure you want to add ${newUsers.length} users?`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleCancelAddUsers} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAddUsers}
              color="primary"
              disabled={isAddingUsers}
            >
              {isAddingUsers ? "Adding..." : "Confirm"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Message Dialog */}
        <Dialog open={messageDialogOpen} onClose={() => setMessageDialogOpen(false)}>
          <DialogTitle>{messageType === "success" ? "Success" : "Error"}</DialogTitle>
          <DialogContent>
            <Typography>{message}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMessageDialogOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default UserManagement;
