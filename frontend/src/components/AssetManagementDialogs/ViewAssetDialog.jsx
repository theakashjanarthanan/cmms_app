// ViewAssetDialog.js

import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Button,
} from "@mui/material";

const ViewAssetDialog = ({ viewDialog, handleViewDialogClose, formData }) => {
  return (
    <Dialog
      open={viewDialog}
      onClose={handleViewDialogClose}
      sx={{
        backdropFilter: "blur(5px)",
        background: "rgba(255, 255, 255, 0.9)",
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          fontSize: "1.2rem",
          backgroundColor: "#f5f5f5",
          padding: "16px 24px",
        }}
      >
        View Asset Details
      </DialogTitle>
      <DialogContent sx={{ padding: "24px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Asset ID:
            </Typography>
            <Typography variant="body1">{formData.assetID}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Asset Name:
            </Typography>
            <Typography variant="body1">{formData.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Display Name:
            </Typography>
            <Typography variant="body1">{formData.displayName}</Typography>
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
              Department:
            </Typography>
            <Typography variant="body1">{formData.department}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Warranty Status:
            </Typography>
            <Typography variant="body1">{formData.warrantyStatus}</Typography>
          </Grid>

          {/* Warranty Expiration Date in 12-hour format */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Warranty Expiration:
            </Typography>
            <Typography variant="body1">
              {formData.warrantyExpirationDate
                ? new Date(formData.warrantyExpirationDate).toLocaleString(
                    "en-US",
                    {
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                      hour12: true,
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )
                : "N/A"}
            </Typography>
          </Grid>

          {/* Created At and Updated At */}
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
      <DialogActions sx={{ padding: "16px 24px", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleViewDialogClose}
          sx={{ width: "100%", maxWidth: "200px" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAssetDialog;
