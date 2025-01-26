import React from "react"; // Importing React to define the component
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
    <Dialog open={open} onClose={onClose}> {/* The dialog component is shown if 'open' is true */}
      <DialogTitle>{editingAsset ? "Edit Asset" : "Create Asset"}</DialogTitle> {/* Title based on whether editing or creating an asset */}
      <DialogContent>
        <form onSubmit={onSubmit}> {/* Form submission handler */}
          <Grid container spacing={3}> {/* Grid layout for the form */}
            
            {/* Left Side of the Form (3 inputs) */}
            <Grid item xs={12} sm={6}>
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
                multiline // Allows multiple lines for the description
                rows={3} // Sets the number of rows visible
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
                select // Dropdown menu for selection
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
                select // Dropdown menu for category selection
                label="Category"
                value={formData?.category || ""} // Handles default value if category is not set
                onChange={handleChange}
                fullWidth
                margin="normal"
              >
                {/* Placeholder option */}
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>
                {/* List of category options */}
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
        {/* Buttons to close the dialog or submit the form */}
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
        <Button
          onClick={onSubmit} // Trigger the onSubmit callback
          color="primary"
          variant="contained"
          disabled={loading} // Disable the submit button while loading
        >
          {loading ? "Saving..." : editingAsset ? "Update" : "Create"} {/* Change button text based on loading or editing state */}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssetDialog; 
