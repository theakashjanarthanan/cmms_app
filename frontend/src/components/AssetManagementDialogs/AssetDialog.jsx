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
          <Grid container spacing={2}>
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
                name="displayName"
                label="Display Name"
                value={formData.displayName}
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
                required
                fullWidth
                margin="normal"
              />
            </Grid>
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
                <MenuItem value="Operational">Operational</MenuItem>
                <MenuItem value="Out of Service">Out of Service</MenuItem>
              </TextField>
              <TextField
                name="model"
                label="Model"
                value={formData.model}
                onChange={handleChange}
                required
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
              <TextField
                name="serialNumber"
                label="Serial Number"
                value={formData.serialNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="department"
                label="Department"
                value={formData.department}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="warrantyStatus"
                select
                label="Warranty Status"
                value={formData.warrantyStatus}
                onChange={handleChange}
                fullWidth
                margin="normal"
              >
                <MenuItem value="Warranty">Warranty</MenuItem>
                <MenuItem value="Out of Warranty">Out of Warranty</MenuItem>
              </TextField>
              <TextField
                name="warrantyExpirationDate"
                label="Warranty Expiration Date"
                type="date"
                value={formData.warrantyExpirationDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
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
