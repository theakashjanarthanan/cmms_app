import React from "react"; 
import {
  Drawer,
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
    <Drawer
      anchor="right" // Drawer will slide in from the right
      open={open}
      onClose={onClose}
      sx={{
        width: 500, // Adjust width as needed
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 500, // Set the width of the drawer
          padding: 3,  // Add padding inside the drawer
        },
      }}
    >
      <DialogTitle>{editingAsset ? "Edit Asset" : "Create Asset"}</DialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit}> {/* Form submission handler */}
          <Grid container spacing={3}> {/* Grid layout for the form */}
            {/* Stack all fields vertically by ensuring each Grid item takes full width */}
            
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Asset Name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
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
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="model"
                label="Model"
                value={formData.model}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="status"
                select
                label="Status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                margin="normal"
              >
                <MenuItem value="" disabled>Select Operational Status</MenuItem>
                <MenuItem value="Operational">Operational</MenuItem>
                <MenuItem value="Out of Service">Out of Service</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="category"
                select
                label="Category"
                value={formData?.category || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              >
                <MenuItem value="" disabled>Select Category</MenuItem>
                {["None", "Damage", "Electrical", "Inspection", "Meter", "Preventative", "Project", "Safety"].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="serialNumber"
                label="Serial Number"
                value={formData.serialNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
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
        <Button onClick={onClose} color="secondary">Close</Button>
        <Button
          onClick={onSubmit}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Saving..." : editingAsset ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Drawer>
  );
};

export default AssetDialog;
