import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

function PreventiveMaintenanceEditDialog({ open, handleCloseDialog, formData, handleChange, handleSubmit }) {
  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle>Edit Preventive Maintenance</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Display Name"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Start Date"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Due Date"
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      
      {/* Edit Confirmation  */}
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PreventiveMaintenanceEditDialog;
