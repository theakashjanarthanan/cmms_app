import React from "react"; // Importing React to define the component
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Button,
} from "@mui/material"; // Importing Material UI components

const ViewAssetDialog = ({ 
  viewDialog, // State variable to control dialog visibility
  handleViewDialogClose, // Function to close the dialog
  formData, // Object containing asset data to display
}) => {
  return (
    <Dialog
      open={viewDialog} // Dialog open/close based on viewDialog state
      onClose={handleViewDialogClose} // Closes dialog when clicked outside
      sx={{
        backdropFilter: "blur(5px)", // Adds a blur effect to the backdrop
        background: "rgba(255, 255, 255, 0.9)", // Sets the background transparency
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold", // Bold title font
          fontSize: "1.2rem", // Font size for title
          backgroundColor: "#f5f5f5", // Background color for title
          padding: "16px 24px", // Title padding
        }}
      >
        View Asset Details {/* Title of the dialog */}
      </DialogTitle>
      <DialogContent sx={{ padding: "24px" }}> {/* Padding around the content */}
        <Grid container spacing={3}> {/* Grid container to hold the asset details */}
          {/* Each Grid item displays a label and the corresponding asset detail */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Asset Name:
            </Typography>
            <Typography variant="body1">{formData.name}</Typography> {/* Displaying the asset name */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Status:
            </Typography>
            <Typography variant="body1">{formData.status}</Typography> {/* Displaying the status */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Model:
            </Typography>
            <Typography variant="body1">{formData.model}</Typography> {/* Displaying the model */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Manufacturer:
            </Typography>
            <Typography variant="body1">{formData.manufacturer}</Typography> {/* Displaying the manufacturer */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Serial Number:
            </Typography>
            <Typography variant="body1">{formData.serialNumber}</Typography> {/* Displaying the serial number */}
          </Grid>
          {/* Duplicate Manufacturer field, should be removed if redundant */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Manufacturer:
            </Typography>
            <Typography variant="body1">{formData.manufacturer}</Typography> {/* Duplicate manufacturer field */}
          </Grid>
          {/* Description */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Description:
            </Typography>
            <Typography variant="body1">{formData.description}</Typography> {/* Duplicate Description field */}
          </Grid>
          {/* Display the 'Created At' and 'Updated At' dates */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Created At:
            </Typography>
            <Typography variant="body1">
              {/* Format the creation date */}
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
              {/* Format the updated date, or display 'N/A' if not available */}
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
      <DialogActions sx={{ padding: "16px 24px", justifyContent: "center" }}>
        {/* Action button to close the dialog */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewDialogClose} // Close the dialog when clicked
          sx={{ width: "100%", maxWidth: "200px" }} // Style for the button
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAssetDialog;  
