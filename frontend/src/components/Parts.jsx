// frontend\src\components\Parts.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Snackbar,
  Alert,
} from "@mui/material";

import { createPart, getParts, deletePart } from "../api/api";  // API

const Parts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    partNumber: "",
    description: "",
    assignedWorker: "",
    assignedTeams: "",
    type: "critical",
    location: "",
    additionalInfo: "",
    cost: "",
    availableQuantity: "",
    maxQuantity: "",
    minQuantity: "",
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [parts, setParts] = useState([]);

  // For part details popup
  const [selectedPart, setSelectedPart] = useState(null);
  const [isPartDetailDialogOpen, setIsPartDetailDialogOpen] = useState(false);

  // Define the dialog open state and part to delete state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [partToDelete, setPartToDelete] = useState(null);

  // Snackbar Notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' | 'error' | 'info' | 'warning'

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Fetch parts on initial load
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const partsData = await getParts();
        setParts(partsData);
      } catch (error) {
        console.error("Error fetching parts:", error);
      }
    };
    fetchParts();
  }, []);

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDialogOpen = () => setIsDialogOpen(true);

  const handleDialogClose = () => setIsDialogOpen(false);

  const handleCreatePart = () => {
    const {
      name,
      partNumber,
      cost,
      availableQuantity,
      maxQuantity,
      minQuantity,
    } = formData;
    if (
      !name ||
      !partNumber ||
      !cost ||
      isNaN(cost) ||
      !availableQuantity ||
      isNaN(availableQuantity) ||
      isNaN(maxQuantity) ||
      isNaN(minQuantity)
    ) {
      alert("Please fill in all required fields with valid data.");
      return;
    }
    setIsConfirmOpen(true); // Open confirmation dialog
  };

  const handleConfirmClose = async () => {
    try {
      await createPart(formData); // API call to create part
      alert("Part created successfully");
      setFormData({
        // Reset form after successful creation
        name: "",
        partNumber: "",
        description: "",
        assignedWorker: "",
        assignedTeams: "",
        type: "critical",
        location: "",
        additionalInfo: "",
        cost: "",
        availableQuantity: "",
        maxQuantity: "",
        minQuantity: "",
      });
    } catch (error) {
      console.error("Error creating part:", error);
      alert("Failed to create part");
    } finally {
      setIsConfirmOpen(false);
      setIsDialogOpen(false);
    }
  };

  const handleDiscardClose = () => {
    setIsDiscardOpen(false);
    setIsDialogOpen(false); // Close main dialog
  };

  const handleDiscardCancel = () => setIsDiscardOpen(false);

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  // Pagination Handlers
  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page changes
  };

  // Helper function to calculate the status
  const calculateStatus = (part) => {
    if (part.availableQuantity === 0) return "Out of Stock";
    if (part.availableQuantity < part.minQuantity) return "Low Stock";
    if (part.availableQuantity > part.maxQuantity) return "In Stock";
    return "In Stock"; // Default status if none of the above conditions are met
  };

  // Handle row click to show part details in a dialog
  const handleRowClick = (part) => {
    setSelectedPart(part);
    setIsPartDetailDialogOpen(true);
  };

  // Close part details dialog
  const handlePartDetailDialogClose = () => setIsPartDetailDialogOpen(false);

  // Delete Function
  const handleDeleteConfirm = async () => {
    try {
      if (partToDelete) {
        await deletePart(partToDelete._id);
        setParts(parts.filter((part) => part._id !== partToDelete._id)); // Remove deleted part from UI
        setIsDeleteDialogOpen(false); // Close dialog after deletion

        // Show success notification
        setSnackbarMessage("Part deleted successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error deleting part:", error);

      // Show error notification
      setSnackbarMessage("Failed to delete part");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteClick = (part) => {
    setPartToDelete(part);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => setIsDeleteDialogOpen(false);

  return (
    <Box>
      <Button variant="contained" onClick={handleDialogOpen}>
        Create Part
      </Button>

      {/* Main Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        {/* Create Part Dialog */}
        <DialogTitle>Create Part</DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Details" />
            <Tab label="Inventory" />
          </Tabs>

          {activeTab === 0 && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Part Number"
                name="partNumber"
                value={formData.partNumber}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Assigned Worker"
                name="assignedWorker"
                value={formData.assignedWorker}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Assigned Teams"
                name="assignedTeams"
                value={formData.assignedTeams}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                margin="normal"
                select
                SelectProps={{ native: true }}
              >
                <option value="critical">Critical Part</option>
                <option value="non-stock">Non-Stock Part</option>
              </TextField>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Additional Information"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                margin="normal"
              />
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Cost"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                margin="normal"
                InputProps={{ startAdornment: <span>$</span> }}
              />
              <TextField
                fullWidth
                label="Available Quantity"
                name="availableQuantity"
                value={formData.availableQuantity}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Max Quantity"
                name="maxQuantity"
                value={formData.maxQuantity}
                onChange={handleInputChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Minimum Quantity"
                name="minQuantity"
                value={formData.minQuantity}
                onChange={handleInputChange}
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleCreatePart}
            variant="contained"
            color="primary"
          >
            Create Part
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Creation Dialog */}
      <Dialog open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
        <DialogTitle>Confirm Creation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to create this part?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfirmOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmClose}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Discard Dialog */}
      <Dialog open={isDiscardOpen} onClose={handleDiscardCancel}>
        <DialogTitle>Discard Changes?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to discard changes?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscardCancel} color="secondary">
            No
          </Button>
          <Button
            onClick={handleDiscardClose}
            variant="contained"
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <>
        {/* Table displaying parts */}
        <TableContainer
          component={Paper}
          sx={{
            mt: 4,
            overflowX: "auto",  
          }}
        >
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100 text-gray-700 font-semibold text-center">
                <TableCell className="font-semibold">S.No</TableCell>
                <TableCell className="font-semibold">Name</TableCell>
                <TableCell className="font-semibold">Part Number</TableCell>
                <TableCell className="font-semibold">Type</TableCell>
                <TableCell className="font-semibold">
                  Available Quantity
                </TableCell>
                <TableCell className="font-semibold">Cost</TableCell>
                <TableCell className="font-semibold">Assigned Worker</TableCell>
                <TableCell className="font-semibold">Assigned Teams</TableCell>
                <TableCell className="font-semibold">Status</TableCell>
                <TableCell className="font-semibold">Created At</TableCell>
                <TableCell className="font-semibold">Updated At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parts.length === 0 ||
              parts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" className="no-data">
                    No parts available.
                  </TableCell>
                </TableRow>
              ) : (
                parts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((part, index) => (
                    <TableRow
                      key={part._id}
                      onClick={() => handleRowClick(part)}
                      className="hover:bg-gray-50 transition-all"
                    >
                      <TableCell className="px-6 py-3 text-center font-medium">
                        {page * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell className="px-6 py-3 font-medium">
                        {part.name}
                      </TableCell>
                      <TableCell className="px-6 py-3 font-medium">
                        {part.partNumber}
                      </TableCell>
                      <TableCell className="px-6 py-3 font-medium">
                        {part.type}
                      </TableCell>
                      <TableCell className="px-6 py-3 font-medium">
                        {part.availableQuantity}
                      </TableCell>
                      <TableCell className="px-6 py-3 font-medium">
                        {part.cost}
                      </TableCell>
                      <TableCell className="px-6 py-3 font-medium">
                        {part.assignedWorker}
                      </TableCell>
                      <TableCell className="px-6 py-3 font-medium">
                        {part.assignedTeams.join(", ")}
                      </TableCell>
                      <TableCell className="px-6 py-3 font-medium">
                        {calculateStatus(part)}
                      </TableCell>
                      <TableCell className="px-6 py-3 font-medium">
                        {new Date(part.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="px-6 py-3 font-medium">
                        {new Date(part.updatedAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={parts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="pagination-container"
          />
        </TableContainer>
      </>

      {/* Part Details Dialog */}
      <Dialog
        open={isPartDetailDialogOpen}
        onClose={handlePartDetailDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", py: 2 }}
        >
          Part Details
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          {selectedPart && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Header Section */}
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {selectedPart.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "text.secondary" }}
                >
                  Part Number: {selectedPart.partNumber}
                </Typography>
              </Box>

              {/* Details Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 3,
                }}
              >
                <Typography>
                  <strong>Description:</strong> {selectedPart.description}
                </Typography>
                <Typography>
                  <strong>Type:</strong> {selectedPart.type}
                </Typography>
                <Typography>
                  <strong>Location:</strong> {selectedPart.location}
                </Typography>
                <Typography>
                  <strong>Assigned Worker:</strong>{" "}
                  {selectedPart.assignedWorker}
                </Typography>
                <Typography>
                  <strong>Assigned Teams:</strong>{" "}
                  {selectedPart.assignedTeams.join(", ")}
                </Typography>
                <Typography>
                  <strong>Cost:</strong> ${selectedPart.cost.toFixed(2)}
                </Typography>
                <Typography>
                  <strong>Available Quantity:</strong>{" "}
                  {selectedPart.availableQuantity}
                </Typography>
                <Typography>
                  <strong>Max Quantity:</strong> {selectedPart.maxQuantity}
                </Typography>
                <Typography>
                  <strong>Min Quantity:</strong> {selectedPart.minQuantity}
                </Typography>
                <Typography>
                  <strong>Status:</strong> {calculateStatus(selectedPart)}
                </Typography>
              </Box>

              {/* Timestamps */}
              <Box
                sx={{
                  mt: 4,
                  pt: 2,
                  borderTop: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedPart.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  <strong>Updated At:</strong>{" "}
                  {new Date(selectedPart.updatedAt).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, justifyContent: "flex-end" }}>
          
          {/* Close Button */}
          <Button
            onClick={handlePartDetailDialogClose}
            variant="contained"
            color="primary"
            size="large"
          >
            Close
          </Button>

          {/* Delete Button */}
          <Button
            onClick={() => handleDeleteClick(selectedPart)}
            color="secondary"
            variant="outlined"
            size="large"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this part?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>

        {/* Snackbar Notification for Deletion */}
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
      </Dialog>
    </Box>
  );
};

export default Parts;
