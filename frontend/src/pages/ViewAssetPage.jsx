import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Dialog, DialogTitle, DialogContent, DialogActions, Box, Grid, Button, Typography, Snackbar } from "@mui/material";
import { 
  fetchSingleAsset, 
  updateAsset, 
  deleteAsset } from "../api/assetapi";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header/header"
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssetDialog from "../components/AssetManagement/AssetDialog";

const ViewAssetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    model: "",
    manufacturer: "",
    serialNumber: "",
    category: "",
    status: "",
  });

  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [setSnackbarOpen] = useState(false); // Snackbar state
  const [setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success", //"success", "error", "warning", "info"
  });

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const loadAsset = async () => {
      try {
        setLoading(true);
        const data = await fetchSingleAsset(id);
        setAsset(data);
        setFormData({
          name: data.name,
          status: data.status || "",
          model: data.model,
          manufacturer: data.manufacturer,
          serialNumber: data.serialNumber,
          category: data.category || "",
          description: data.description,
        });
        console.log("Assets Fetched SuccessFully")
      } catch (error) {
        setError("Error fetching asset details");
        console.error("Error fetching asset details:", error);
        setSnackbar({
          open: true,
          message: "Error fetching asset details",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };
  
    loadAsset();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleEditAsset = () => {
    setIsDialogOpen(true);
  };

   // Open Delete Dialog
   const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  // Close Delete Dialog
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  // Delete Asset Function
  const handleDelete = async () => {
    try {
      await deleteAsset(id);
  
      setSnackbar({
        open: true,
        message: "Asset deleted successfully!",
        type: "success",
      });
  
      // Wait for a moment before navigating away
      setTimeout(() => {
        navigate(-1);
      }, 1500); // 1.5 seconds delay
      console.log("Asset Deleted Successfully")
    } catch (error) {
      console.error("Error deleting asset:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete asset.",
        type: "error",
      });
    }
    handleDeleteDialogClose(); // Close the delete dialog
  };
  
  
  const handleDialogClose = async (updatedAsset) => {
    setIsDialogOpen(false);

    if (updatedAsset) {
      try {
        setLoadingUpdate(true);
        const updatedData = await updateAsset(id, formData);
        setAsset(updatedData);

        const data = await fetchSingleAsset(id);
        setAsset(data);
        setFormData({
          name: updatedData.name,
          status: updatedData.status || "",
          model: updatedData.model,
          manufacturer: updatedData.manufacturer,
          serialNumber: updatedData.serialNumber,
          category: updatedData.category || "",
          description: updatedData.description,
        });
        setSnackbar({
          open: true,
          message: "Asset Updated successfully!",
          type: "success",
        });
        console.log("Asset Updated Successfully")
      } catch (error) {
        console.error("Error updating asset:", error);
        setSnackbarMessage("Error updating asset.");
        setSnackbarOpen(true);
      } finally {
        setLoadingUpdate(false);
      }
    }
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!asset) return <div>Asset not found.</div>;

  const toggleSidebar = () => {
    setIsSidebarMinimized((prev) => !prev);  // Toggle sidebar state
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box sx={{ width: "250px", flexShrink: 0 }}>
        <Sidebar isMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} />
      </Box>

      <Box sx={{ flexGrow: 1, padding: "8px", overflowY: "auto" }}>
        <Header
          title={
            <>
              <ArrowBackIcon sx={{ marginRight: "8px", cursor: "pointer" }} onClick={handleBackClick} />
              {asset.name}
            </>
          }
          buttonText="Edit"
          buttonAction={handleEditAsset}
          buttonStyles={{
            backgroundColor: "white",
            border: "1px solid black",
            color: "black",
            padding: "6px 12px",
            "&:hover": {
              backgroundColor: "#f1f1f1",
            },
          }}
          menuItems={[{ label: "Delete", onClick: handleDeleteDialogOpen  }]}
        />


        <div style={{ height: "50px", padding: "8px 16px", borderBottom: "1px solid #e2e1e1" }}>
          <Button onClick={() => handleTabChange(0)} sx={{ marginRight: "12px", color: "black" }}>
            Details
          </Button>
          <Button onClick={() => handleTabChange(1)} sx={{ color: "black" }}>
            Work Orders
          </Button>
        </div>

        {selectedTab === 0 && (
          <Grid container spacing={2}>
            {[{ label: "Asset Name", value: asset.name },
              { label: "Status", value: asset.status },
              { label: "Model", value: asset.model },
              { label: "Manufacturer", value: asset.manufacturer },
              { label: "Serial Number", value: asset.serialNumber },
              { label: "Category", value: asset.category },
              { label: "Description", value: asset.description },
              { label: "Created At", value: new Date(asset.createdAt).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
                year: "numeric",
                month: "long",
                day: "numeric",
              }) },
              { label: "Updated At", value: new Date(asset.updatedAt).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: true,
                year: "numeric",
                month: "long",
                day: "numeric",
              }) },
            ].map((item, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: "flex", alignItems: "center", paddingLeft: "20px" }}>
                  <Typography sx={{ width: "150px", color: "grey" }}>{item.label}:</Typography>
                  <Typography sx={{ marginLeft: "20px" }}>{item.value}</Typography>
                </Box>
                <hr />
              </Grid>
            ))}
          </Grid>
        )}

        {selectedTab === 1 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>No Work Order Assigned Yet</Typography>
            </Grid>
          </Grid>
        )}
      </Box>

      <AssetDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleDialogClose}
        loading={loadingUpdate}
        editingAsset={true}
        formData={formData}
        handleChange={handleFormChange}
      />

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete Asset</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this asset?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
  open={snackbar.open}
  autoHideDuration={6000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: "top", horizontal: "center" }} 
>
  <Alert
    onClose={handleSnackbarClose}
    severity={snackbar.type}
  >
    {snackbar.message}
  </Alert>
</Snackbar>
    </Box>
  );
};

export default ViewAssetPage;
