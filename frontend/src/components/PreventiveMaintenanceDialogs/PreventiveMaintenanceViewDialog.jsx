import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

function PreventiveMaintenanceViewDialog({ open, handleClose, pmDetails }) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Preventive Maintenance Details</DialogTitle>
      <DialogContent>
        {pmDetails && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 3,
              marginTop: 2,
            }}
          >
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Asset:
              </Typography>
              <Typography variant="body2">{pmDetails.asset.name}</Typography>
            </div>

            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Location:
              </Typography>
              <Typography variant="body2">{pmDetails.location}</Typography>
            </div>

            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Start Date:
              </Typography>
              <Typography variant="body2">
                {new Date(pmDetails.startDate).toLocaleDateString()}
              </Typography>
            </div>

            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Due Date:
              </Typography>
              <Typography variant="body2">
                {new Date(pmDetails.dueDate).toLocaleDateString()}
              </Typography>
            </div>

            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Worker:
              </Typography>
              <Typography variant="body2">{pmDetails.worker.fullName}</Typography>
            </div>

            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Team:
              </Typography>
              <Typography variant="body2">{pmDetails.team.name}</Typography>
            </div>

            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Title:
              </Typography>
              <Typography variant="body2">{pmDetails.title}</Typography>
            </div>

            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Display Name:
              </Typography>
              <Typography variant="body2">{pmDetails.displayName}</Typography>
            </div>

            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Description:
              </Typography>
              <Typography variant="body2">{pmDetails.description}</Typography>
            </div>

            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Priority:
              </Typography>
              <Typography variant="body2">{pmDetails.priority}</Typography>
            </div>

            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Category:
              </Typography>
              <Typography variant="body2">{pmDetails.category}</Typography>
            </div>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PreventiveMaintenanceViewDialog;
