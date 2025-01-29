// frontend\src\components\PeoplesandTeams\ViewTeamDialog.jsx

import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Grid,
} from "@mui/material";

const ViewTeamDialog = ({ open, onClose, team }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Team Details</DialogTitle>
      <DialogContent sx={{ padding: "24px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Team Name:
            </Typography>
            <Typography variant="body1">{team?.name || "N/A"}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Description:
            </Typography>
            <Typography variant="body1">
              {team?.description || "N/A"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Number of Workers:
            </Typography>
            <Typography variant="body1">
              {team?.workers?.length || "0"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Team Created At:
            </Typography>
            <Typography variant="body1">
              {team?.createdAt
                ? new Date(team.createdAt).toLocaleString()
                : "Not Available"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Team Updated At:
            </Typography>
            <Typography variant="body1">
              {team?.updatedAt
                ? new Date(team.updatedAt).toLocaleString()
                : "Not Available"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Workers:
            </Typography>
            {team?.workers && team.workers.length > 0 ? (
              team.workers.map((worker, index) => (
                <Typography variant="body1" key={worker._id}>
                  {index + 1}. {worker.fullName} ({worker.email})
                </Typography>
              ))
            ) : (
              <Typography variant="body1">No workers assigned</Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          color="error"
          variant="contained"
          sx={{ width: "100%", maxWidth: "200px" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewTeamDialog;
