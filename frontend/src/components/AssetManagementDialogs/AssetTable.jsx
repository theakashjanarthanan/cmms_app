import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Checkbox,
  Snackbar,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AssetTable = ({
  assets,
  onView,
  selectedColumns,
  selectedStatus,
  setAssets,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: "assetID",
    direction: "asc",
  });
  const [selectedAssets, setSelectedAssets] = useState([]); // Track selected assets
  const [toastOpen, setToastOpen] = useState(false);

  const handleSort = (key) => {
    const isAscending =
      sortConfig.key === key && sortConfig.direction === "asc";
    setSortConfig({ key, direction: isAscending ? "desc" : "asc" });
  };

  const handleSelect = (assetId) => {
    setSelectedAssets((prevSelected) => {
      const updatedSelected = prevSelected.includes(assetId)
        ? prevSelected.filter((id) => id !== assetId)
        : [...prevSelected, assetId];

      // Show the toast when assets are selected or deselected
      setToastOpen(true);

      return updatedSelected;
    });
  };

  const handleRowClick = (event, asset) => {
    // Prevent view dialog trigger if checkbox is clicked
    if (event.target.type === "checkbox") return;
    onView(asset);
  };

  const filteredAssets = assets.filter((asset) =>
    selectedStatus ? asset.status === selectedStatus : true,
  );

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedAssets = sortedAssets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) =>
    setRowsPerPage(parseInt(event.target.value, 10));

  const handleToastClose = () => setToastOpen(false);

  // Delete selected assets
  const handleDelete = () => {
    const remainingAssets = assets.filter(
      (asset) => !selectedAssets.includes(asset._id),
    );
    setAssets(remainingAssets); // Update the assets state by passing the updated list
    setSelectedAssets([]); // Clear the selected assets after deletion
    setToastOpen(false); // Close the toast after deletion
  };

  return (
    <div style={{ height: "100%", width: "100%", overflow: "auto" }}>
      <TableContainer
        component={Paper}
        style={{
          maxWidth: "100%",
          overflowX: "auto",
          padding: "16px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {selectedColumns.includes("name") && (
                <TableCell>
                  <Checkbox
                    checked={selectedAssets.length === assets.length}
                    onChange={() => {
                      if (selectedAssets.length === assets.length) {
                        setSelectedAssets([]); // Deselect all
                      } else {
                        setSelectedAssets(assets.map((asset) => asset._id)); // Select all
                      }
                    }}
                  />
                </TableCell>
              )}
              {selectedColumns.includes("assetID") && (
                <TableCell sx={{ fontWeight: "bold" }}>
                  <TableSortLabel
                    active={sortConfig.key === "assetID"}
                    direction={sortConfig.direction}
                    onClick={() => handleSort("assetID")}
                  >
                    SNO
                  </TableSortLabel>
                </TableCell>
              )}
              {selectedColumns.includes("name") && (
                <TableCell sx={{ fontWeight: "bold" }}>Asset Name</TableCell>
              )}
              {selectedColumns.includes("manufacturer") && (
                <TableCell sx={{ fontWeight: "bold" }}>Manufacturer</TableCell>
              )}
              {selectedColumns.includes("serialNumber") && (
                <TableCell sx={{ fontWeight: "bold" }}>Serial Number</TableCell>
              )}
              {selectedColumns.includes("category") && (
                <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
              )}
              {selectedColumns.includes("model") && (
                <TableCell sx={{ fontWeight: "bold" }}>Model</TableCell>
              )}
              {selectedColumns.includes("status") && (
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No assets available.
                </TableCell>
              </TableRow>
            ) : (
              paginatedAssets.map((asset, index) => (
                <TableRow
                  key={asset._id}
                  hover
                  onClick={(event) => handleRowClick(event, asset)}
                  style={{ cursor: "pointer" }}
                >
                  {selectedColumns.includes("name") && (
                    <TableCell>
                      <Checkbox
                        checked={selectedAssets.includes(asset._id)}
                        onChange={() => handleSelect(asset._id)}
                      />
                    </TableCell>
                  )}
                  {selectedColumns.includes("assetID") && (
                    <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                  )}
                  {selectedColumns.includes("name") && (
                    <TableCell>{asset.name}</TableCell>
                  )}
                  {selectedColumns.includes("manufacturer") && (
                    <TableCell>{asset.manufacturer}</TableCell>
                  )}
                  {selectedColumns.includes("serialNumber") && (
                    <TableCell>{asset.serialNumber}</TableCell>
                  )}
                  {selectedColumns.includes("category") && (
                    <TableCell>{asset.category}</TableCell>
                  )}
                  {selectedColumns.includes("model") && (
                    <TableCell>{asset.model}</TableCell>
                  )}
                  {selectedColumns.includes("status") && (
                    <TableCell>
                      <span
                        className="downtimeStatus"
                        style={{
                          backgroundColor: "rgb(230, 246, 231)",
                          maxWidth: "fit-content",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          textTransform: "capitalize",
                          color: "rgb(50, 50, 51)",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "16px",
                          fontWeight: "400",
                          lineHeight: "20px",
                          overflowWrap: "break-word",
                          display: "block",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          pointerEvents: "none",
                        }}
                        data-cy={asset.status}
                      >
                        {asset.status}
                      </span>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredAssets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // Center the snackbar
        message={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            marginLeft="30px"
          >
            <Typography variant="body2" textAlign="center">
              {selectedAssets.length} selected
            </Typography>
            <Box display="flex" gap="12px" ml={2}>
              <Typography
                variant="body2"
                color="white"
                style={{ cursor: "pointer" }}
                onClick={handleDelete} // Delete selected assets
                sx={{
                  padding: "6px 12px", // Add some padding for spacing
                  borderRadius: "4px", // Rounded corners
                  "&:hover": {
                    backgroundColor: "#757575", // Grey background on hover
                  },
                }}
              >
                Delete
              </Typography>
            </Box>
          </Box>
        }
        action={
          <IconButton size="small" color="inherit" onClick={handleToastClose}>
            <CloseIcon />
          </IconButton>
        }
      />
    </div>
  );
};

export default AssetTable;
