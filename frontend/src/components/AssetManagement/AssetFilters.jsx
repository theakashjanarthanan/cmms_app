// frontend\src\components\AssetManagementDialogs\AssetFilters.jsx

import React, { useState } from "react";
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // Import Add icon

const AssetFilters = ({ selectedStatus, onStatusChange }) => {
  // State to control the visibility of the dialogs
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddFilterDialog, setOpenAddFilterDialog] = useState(false); // State for Add Filter dialog
  // Temporary state to hold the selected status when Add Filter dialog is open
  const [tempStatus, setTempStatus] = useState(selectedStatus);
  // State to manage the visibility of the Status dropdown in Filters Dialog
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  // State to manage whether the Status checkbox is checked
  const [isStatusChecked, setIsStatusChecked] = useState(false);
  // State to track if any filters are applied
  const [filtersApplied, setFiltersApplied] = useState(false);

  // Handle the opening of the Filters dialog
  const handleFilterButtonClick = () => {
    setOpenDialog(true);
  };

  // Handle the closing of the Filters dialog
  const handleCancel = () => {
    setOpenDialog(false);
    setTempStatus(selectedStatus); // Reset to current status
  };

  // Apply the selected status and close the Filters dialog
  const handleApply = () => {
    onStatusChange(tempStatus);
    setFiltersApplied(true); // Mark filters as applied
    setOpenDialog(false);
  };

  // Handle the opening of the "Add Filter" dialog
  const handleAddFilter = () => {
    setOpenAddFilterDialog(true); // Open the "Add Filter" dialog
  };

  // Close the "Add Filter" dialog and show the status dropdown in the Filters dialog
  const handleAddFilterApply = () => {
    if (isStatusChecked) {
      setShowStatusDropdown(true); // Show the status dropdown if checkbox is checked
    }
    setFiltersApplied(true); // Mark filters as applied
    setOpenAddFilterDialog(false); // Close the "Add Filter" dialog
  };

  // Close the "Add Filter" dialog without showing the status dropdown
  const handleAddFilterCancel = () => {
    setOpenAddFilterDialog(false); // Close the "Add Filter" dialog
  };

  // Handle checkbox toggle for Status filter
  const handleCheckboxChange = (event) => {
    setIsStatusChecked(event.target.checked);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "2px",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          padding: "3px 20px",
          fontSize: "14px",
          borderRadius: "5px",
          backgroundColor: "white",
          color: "black",
          border: "1px solid rgb(184, 184, 184)",
          boxShadow: "none", // Remove shadow
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.08)", // Add hover background color effect
            borderColor: "rgb(155, 155, 155)", // Change border color on hover
          },
        }}
        onClick={handleFilterButtonClick}
        data-cy="FilterBar-filters-button"
      >
        {/* Inline SVG Icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginRight: "8px" }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 7a1 1 0 100 2 1 1 0 000-2zM6 8a3 3 0 116 0 3 3 0 01-6 0z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 8a1 1 0 011-1h4a1 1 0 010 2H3a1 1 0 01-1-1zM10 8a1 1 0 011-1h10a1 1 0 110 2H11a1 1 0 01-1-1zM15 15a1 1 0 100 2 1 1 0 000-2zm-3 1a3 3 0 116 0 3 3 0 01-6 0z"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 16a1 1 0 011-1h10a1 1 0 110 2H3a1 1 0 01-1-1zM16 16a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z"
          />
        </svg>
        Filters
      </Button>

      {/* Dialog for Filters */}
      <Dialog open={openDialog} onClose={handleCancel} fullWidth>
        <DialogTitle>Filters</DialogTitle>
        <DialogContent>
          {/* Conditional Content for No Filters or Filters Applied */}
          {!filtersApplied ? (
            <div
              style={{ textAlign: "center", fontSize: "16px", color: "#555" }}
            >
              <strong>No filters added yet.</strong>
              <br />
              When you add filters, they'll appear here.
            </div>
          ) : (
            // Initially hidden Status dropdown if filters are applied
            showStatusDropdown && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "20px 0",
                }}
              >
                <FormControl style={{ width: "200px" }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={tempStatus}
                    onChange={(e) => setTempStatus(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Operational">Operational</MenuItem>
                    {/* <MenuItem value="Out of Service">Out of Service</MenuItem> */}
                  </Select>
                </FormControl>
              </div>
            )
          )}
        </DialogContent>
        <DialogActions>
          {/* Add Filter Button inside Filters Dialog */}
          <Button
            onClick={handleAddFilter}
            color="primary"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              marginRight: "auto",
              padding: "6px 12px",
              fontSize: "14px",
            }}
          >
            <AddIcon sx={{ marginRight: "8px" }} /> Add Filter
          </Button>

          <Button
            onClick={handleCancel}
            color="secondary"
            sx={{
              padding: "8px 16px",
              fontSize: "15px",
              lineHeight: "20px",
              backgroundColor: "white",
              color: "black",
              borderRadius: "4px",
              marginRight: "16px",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.08)",
                borderColor: "rgb(155, 155, 155)",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleApply}
            variant="contained"
            color="primary"
            sx={{
              padding: "8px 16px",
              fontSize: "15px",
              lineHeight: "20px",
              fontWeight: "600",
              backgroundColor: "rgb(12, 111, 249)",
              color: "rgb(255, 255, 255)",
              borderRadius: "4px",
              marginRight: "16px",
              "&:hover": {
                backgroundColor: "rgb(8, 85, 200)",
              },
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
      {/* Add Filter Dialog */}
      <Dialog
        open={openAddFilterDialog}
        onClose={handleAddFilterCancel}
        fullWidth
        maxWidth="sm" // Use "sm" for a medium-sized dialog
        PaperProps={{
          style: {
            width: "400px", // Adjust width to fit the medium size (you can modify this as needed)
            maxWidth: "100%", // Ensure it doesn't go beyond the container width
          },
        }}
      >
        <DialogTitle>Add Filter</DialogTitle>
        <DialogContent>
          {/* Checkbox for applying status filter */}
          <FormControlLabel
            control={
              <Checkbox
                checked={isStatusChecked}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label="Status"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddFilterCancel} color="secondary">
            Close
          </Button>
          <Button
            onClick={handleAddFilterApply}
            variant="contained"
            color="primary"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AssetFilters;
