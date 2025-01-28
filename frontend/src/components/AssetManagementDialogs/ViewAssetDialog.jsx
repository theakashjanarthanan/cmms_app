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
import Divider from "@mui/material/Divider";

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
      fullScreen
      sx={{
        backdropFilter: "blur(1px)", // Adds a blur effect to the backdrop
        backgroundColor: "rgb(250, 250, 250)", // Background color change
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI (Custom)', Roboto, 'Helvetica Neue', 'Open Sans (Custom)', system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold", // Bold title font
          fontSize: "1.2rem", // Font size for title
          backgroundColor: "white", // Background color for title
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
              <EditIcon sx={{ color: "black", marginRight: "8px" }} />
              <Typography variant="body1">Edit</Typography>
            </Box>
          </MenuItem>

          <MenuItem
            onClick={handleDelete} // Call the delete function with the formData ID
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <DeleteIcon style={{ color: "#d32f2f", marginRight: "8px" }} />
              <Typography variant="body1" color="error">
                Delete
              </Typography>
            </Box>
          </MenuItem>
        </Menu>
      </DialogTitle>

      <DialogContent sx={{ padding: "24px", backgroundColor: "white" }}>
        {/* Heading for the asset information */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            marginBottom: "24px",
            fontSize: "30px",
          }}
        >
          Asset Information
        </Typography>

        {/* Grid container to hold the asset details */}

        <Grid container spacing={3}>
          {/* Asset Name */}
          <Grid item xs={12}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#767676", // Applying the specified color
                  fontSize: "1.25rem",
                }}
              >
                Asset Name:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: "normal",
                  fontSize: "1.25rem",
                  marginLeft:"200px"
                }}
              >
                {formData.name}
              </Typography>
            </div>
            <Divider sx={{ margin: "16px 0" }} />
          </Grid>

          {/* Status */}
          <Grid item xs={12}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#767676", // Applying the specified color
                  fontSize: "1.25rem",
                }}
              >
                Status:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: "normal",
                  fontSize: "1.25rem",
                  marginLeft:"250px"
                }}
              >
                {formData.status}
              </Typography>
            </div>
            <Divider sx={{ margin: "16px 0" }} />
          </Grid>

          {/* Model */}
          <Grid item xs={12}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#767676", // Applying the specified color
                  fontSize: "1.25rem",
                }}
              >
                Model:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: "normal",
                  fontSize: "1.25rem",
                  marginLeft:"250px"
                }}
              >
                {formData.model}
              </Typography>
            </div>
            <Divider sx={{ margin: "16px 0" }} />
          </Grid>

          {/* Manufacturer */}
          <Grid item xs={12}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#767676", // Applying the specified color
                  fontSize: "1.25rem",
                }}
              >
                Manufacturer:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: "normal",
                  fontSize: "1.25rem",
                  marginLeft:"190px"
                }}
              >
                {formData.manufacturer}
              </Typography>
            </div>
            <Divider sx={{ margin: "16px 0" }} />
          </Grid>

          {/* Serial Number */}
          <Grid item xs={12}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#767676", // Applying the specified color
                  fontSize: "1.25rem",
                }}
              >
                Serial Number:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: "normal",
                  fontSize: "1.25rem",
                  marginLeft: "185px",
                }}
              >
                {formData.serialNumber}
              </Typography>
            </div>
            <Divider sx={{ margin: "16px 0" }} />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#767676", // Applying the specified color
                  fontSize: "1.25rem",
                }}
              >
                Description:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: "normal",
                  fontSize: "1.25rem",
                  marginLeft: "210px"
                }}
              >
                {formData.description}
              </Typography>
            </div>
            <Divider sx={{ margin: "16px 0" }} />
          </Grid>

          {/* Created At */}
          <Grid item xs={12}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#767676", // Applying the specified color
                  fontSize: "1.25rem",
                }}
              >
                Created At:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: "normal",
                  fontSize: "1.25rem",
                  marginLeft:"220px"
                }}
              >
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
            </div>
            <Divider sx={{ margin: "16px 0" }} />
          </Grid>

          {/* Updated At */}
          <Grid item xs={12}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#767676", // Applying the specified color
                  fontSize: "1.25rem",
                }}
              >
                Updated At:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  fontWeight: "normal",
                  fontSize: "1.25rem",
                  marginLeft:"220px"
                }}
              >
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
            </div>
            <Divider sx={{ margin: "16px 0" }} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAssetDialog;
