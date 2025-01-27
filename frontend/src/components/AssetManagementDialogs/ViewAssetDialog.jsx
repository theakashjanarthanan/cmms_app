import React, { useState } from "react"; // Importing React to define the component
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material"; // Importing Material UI components
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Importing ArrowBack Icon
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Importing MoreVert Icon (three-dot menu)
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ViewAssetDialog = ({
  viewDialog, // State variable to control dialog visibility
  handleViewDialogClose, // Function to close the dialog
  formData, // Object containing asset data to display
  onEdit, // Function to handle Edit action
  onDelete, // Function to handle Delete action
}) => {
  const [anchorEl, setAnchorEl] = useState(null); // State to manage the Menu anchor
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    onEdit(formData); // Call the onEdit function passed via props
    handleMenuClose(); // Close the menu after action
    handleViewDialogClose(); // Close the View Asset Dialog after edit
  };

  const handleDelete = () => {
    onDelete(formData._id); // Call the onDelete function passed via props
    handleMenuClose(); // Close the menu after action
    handleViewDialogClose(); // Close the View Asset Dialog after delete
  };

  return (
    <Dialog
      open={viewDialog} // Dialog open/close based on viewDialog state
      onClose={handleViewDialogClose} // Closes dialog when clicked outside
      sx={{
        backdropFilter: "blur(1px)", // Adds a blur effect to the backdrop
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold", // Bold title font
          fontSize: "1.2rem", // Font size for title
          backgroundColor: "#f5f5f5", // Background color for title
          padding: "16px", // Title padding
          position: "relative", // Position relative for close button
          display: "flex", // Use flexbox to align the title and button
          alignItems: "center", // Vertically align items in the center
        }}
      >
        {/* Go Back button in the top-left corner */}
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleViewDialogClose} // Close the dialog when clicked
          sx={{
            position: "absolute",
            left: "16px", // Position the Go Back button on the left edge
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Asset Name displayed right after the Go Back icon with a small margin */}
        <Typography
          sx={{
            marginLeft: "30px", // Small space between the icon and asset name
            fontWeight: "bold", // Bold font for asset name
            fontSize: "1.2rem", // Font size for asset name
          }}
        >
          {formData.name}
        </Typography>

        {/* Three-dot button on the right edge */}
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleMenuOpen} // Open the menu on click
          sx={{
            position: "absolute",
            right: "16px", // Position the three-dot button on the right edge
          }}
        >
          <MoreVertIcon />
        </IconButton>

        {/* Menu for Edit and Delete actions */}
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              minWidth: "120px", // Menu width
            },
          }}
        >
          <MenuItem
            onClick={handleEdit} // Call the edit function with the formData
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EditIcon sx={{ color: "black", marginRight: "8px" }} />{" "}
               
              <Typography variant="body1">Edit</Typography>  
            </Box>
          </MenuItem>

          <MenuItem
            onClick={handleDelete} // Call the delete function with the formData ID
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <DeleteIcon style={{ color: "#d32f2f",  marginRight: "8px"  }} />
              <Typography variant="body1" color="error">
                Delete
              </Typography>
            </Box>
          </MenuItem>
        </Menu>
      </DialogTitle>

      <DialogContent sx={{ padding: "24px" }}>
        {/* Grid container to hold the asset details */}
        <Grid container spacing={3}>
          {/* Each Grid item displays a label and the corresponding asset detail */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Asset Name:
            </Typography>
            <Typography variant="body1">{formData.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Status:
            </Typography>
            <Typography variant="body1">{formData.status}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Model:
            </Typography>
            <Typography variant="body1">{formData.model}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Manufacturer:
            </Typography>
            <Typography variant="body1">{formData.manufacturer}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Serial Number:
            </Typography>
            <Typography variant="body1">{formData.serialNumber}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Description:
            </Typography>
            <Typography variant="body1">{formData.description}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Created At:
            </Typography>
            <Typography variant="body1">
              {new Date(formData.createdAt).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Updated At:
            </Typography>
            <Typography variant="body1">
              {formData.updatedAt
                ? new Date(formData.updatedAt).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true,
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAssetDialog;
