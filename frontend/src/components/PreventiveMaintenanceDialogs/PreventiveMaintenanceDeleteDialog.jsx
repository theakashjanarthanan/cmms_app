import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function PreventiveMaintenanceDeleteDialog({ open, handleDeleteCancel, handleDeleteConfirm }) {
  return (
    <Dialog open={open} onClose={handleDeleteCancel}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <p>Do you want to delete this Preventive Maintenance record?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteCancel} color="primary">
          No
        </Button>
        <Button onClick={handleDeleteConfirm} color="secondary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PreventiveMaintenanceDeleteDialog;
