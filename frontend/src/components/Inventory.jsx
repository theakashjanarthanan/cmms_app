// frontend\src\components\Inventory.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { getParts, updatePartQuantity } from "../api/api";

const Inventory = () => {
  const [parts, setParts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPart, setSelectedPart] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [isAdjustQuantityDialogOpen, setAdjustQuantityDialogOpen] =
    useState(false);
  const [adjustment, setAdjustment] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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

  // Calculate status based on availableQuantity
  const calculateStatus = (part) => {
    if (part.availableQuantity === 0) return "Out of Stock";
    if (part.availableQuantity < part.minQuantity) return "Low Stock";
    if (part.availableQuantity > part.maxQuantity) return "In Stock";
    return "Normal";
  };

  // Pagination Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  // Handle Row Click
  const handleRowClick = (part) => {
    setSelectedPart(part);
    setIsDialogOpen(true);
  };

  // Close Dialog
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedPart(null);
  };

  // Three-Dot Menu Handlers
  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // Adjust Quantity Dialog Handlers
  const handleAdjustQuantityOpen = () => {
    handleMenuClose();
    setAdjustQuantityDialogOpen(true);
  };

  const handleAdjustQuantityClose = () => {
    setAdjustQuantityDialogOpen(false);
    setAdjustment(0);
  };

  const handleAdjustmentChange = (increment) => {
    setAdjustment((prev) => prev + increment);
  };

  const handleConfirmAdjustQuantity = async () => {
    try {
      const newQuantity = selectedPart.availableQuantity + adjustment;
      await updatePartQuantity(selectedPart._id, newQuantity);

      const updatedParts = parts.map((part) =>
        part._id === selectedPart._id
          ? { ...part, availableQuantity: newQuantity }
          : part,
      );
      setParts(updatedParts);

      setSnackbarMessage("Quantity updated successfully!");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Failed to update quantity.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
      handleAdjustQuantityClose();
    }
  };

  // Snackbar Handlers
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Inventory Management
      </Typography>

      <>
        <TableContainer
          component={Paper}
          sx={{
            mt: 4,
            overflowX: "auto", // Enable horizontal scroll
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
                  <TableCell
                    colSpan={11}
                    align="center"
                    sx={{ fontStyle: "bold", color: "gray" }}
                  >
                    No Inventory available.
                  </TableCell>
                </TableRow>
              ) : (
                parts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((part, index) => (
                    <TableRow
                      key={part._id}
                      onClick={() => handleRowClick(part)}
                      sx={{ cursor: "pointer" }}
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
        open={isDialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", py: 2 }}
        >
          Part Details
        </DialogTitle>
        <IconButton
          onClick={handleMenuOpen}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <MoreVertIcon />
        </IconButton>
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
          <Button
            onClick={handleDialogClose}
            variant="contained"
            color="primary"
            size="large"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu */}
      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={handleMenuClose}>
        <MenuItem onClick={handleAdjustQuantityOpen}>Adjust Quantity</MenuItem>
      </Menu>

      {/* Adjust Quantity Dialog */}
      <Dialog
        open={isAdjustQuantityDialogOpen}
        onClose={handleAdjustQuantityClose}
      >
        <DialogTitle>Adjust Quantity</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              onClick={() => handleAdjustmentChange(-1)}
            >
              -
            </Button>
            <TextField value={adjustment} disabled />
            <Button
              variant="outlined"
              onClick={() => handleAdjustmentChange(1)}
            >
              +
            </Button>
          </Box>
          <Box mt={2}>
            <Typography>
              Original Quantity: {selectedPart?.availableQuantity}
            </Typography>
            <Typography>
              New Quantity: {selectedPart?.availableQuantity + adjustment}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAdjustQuantityClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAdjustQuantity} color="primary">
            Adjust Quantity
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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

export default Inventory;
