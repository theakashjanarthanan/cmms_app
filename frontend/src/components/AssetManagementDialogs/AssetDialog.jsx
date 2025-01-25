// frontend\src\components\AssetManagementDialogs\AssetDialog.jsx

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";

const AssetDialog = ({
  open,
  onClose,
  onSubmit,
  loading,
  editingAsset,
  formData,
  handleChange,
}) => {
  return (
<Dialog open={open} onClose={onClose}>
  <DialogTitle>{editingAsset ? "Edit Asset" : "Create Asset"}</DialogTitle>
  <DialogContent>
    <form onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {/* Left Side of the Form (4 inputs) */}
        <Grid item xs={12} sm={6}>
          <TextField
            name="assetID"
            label="Asset ID"
            value={formData.assetID}
            onChange={handleChange}
            disabled={!!editingAsset}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            name="name"
            label="Asset Name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            name="model"
            label="Model"
            value={formData.model}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid>

        {/* Right Side of the Form (4 inputs) */}
        <Grid item xs={12} sm={6}>
          <TextField
            name="status"
            select
            label="Status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {/* Placeholder option */}
            <MenuItem value="" disabled>
              Select Operational Status
            </MenuItem>
            <MenuItem value="Operational">Operational</MenuItem>
            <MenuItem value="Out of Service">Out of Service</MenuItem>
          </TextField>

          <TextField
            name="category"
            select
            label="Category"
            value={formData?.category || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {/* Placeholder option */}
            <MenuItem value="" disabled>
              Select Category
            </MenuItem>
            {[
              "None",
              "Damage",
              "Electrical",
              "Inspection",
              "Meter",
              "Preventative",
              "Project",
              "Safety",
            ].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            name="serialNumber"
            label="Serial Number"
            value={formData.serialNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            name="manufacturer"
            label="Manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid>
      </Grid>
    </form>
  </DialogContent>

  <DialogActions>
    <Button onClick={onClose} color="secondary">
      Close
    </Button>
    <Button
      onClick={onSubmit}
      color="primary"
      variant="contained"
      disabled={loading}
    >
      {loading ? "Saving..." : editingAsset ? "Update" : "Create"}
    </Button>
  </DialogActions>
</Dialog>

  );
};

export default AssetDialog;
