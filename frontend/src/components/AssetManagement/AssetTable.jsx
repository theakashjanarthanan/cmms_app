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

// Component Styles
const styles = {
  tableWrapper: {
    padding: "0 16px", // Outer padding (left and right)
  },
  tableContainer: {
    maxWidth: "100%",
    overflowX: "auto",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    paddingLeft: "0", // Remove padding from here
    paddingRight: "0", // Remove padding from here
  },
  tableHeaderCell: {
    fontSize: "14px", // Header font size smaller
    lineHeight: "20px",
    fontWeight: "600", // Removed bold
    position: "sticky",
    top: "0px",
    zIndex: "5",
    paddingLeft: "24px",
    paddingRight: "3px",
    textAlign: "left",
    backgroundColor: "white",
    userSelect: "none",
    borderBottom: "1px solid rgb(223, 227, 232)",
    color: "rgb(50, 50, 51)",
  },
  tableBodyCell: {
    fontSize: "16px", // Increased font size for body
    paddingLeft: "24px",
    paddingRight: "3px",
    textAlign: "left",
    backgroundColor: "white",
    userSelect: "none",
    borderBottom: "1px solid rgb(223, 227, 232)",
    color: "rgb(50, 50, 51)",
  },
  tableBodyCellName: {
    fontSize: "16px", 
    paddingLeft: "24px",
    paddingRight: "3px",
    textAlign: "left",
    backgroundColor: "white",
    userSelect: "none",
    borderBottom: "1px solid rgb(223, 227, 232)",
    color: "rgb(50, 50, 51)",
    textTransform: "uppercase", // Capitalized "Asset Name" only
  
  },
  tableBodyCellManufacturer: {
    fontSize: "16px", 
    paddingLeft: "24px",
    paddingRight: "3px",
    textAlign: "left",
    backgroundColor: "white",
    userSelect: "none",
    borderBottom: "1px solid rgb(223, 227, 232)",
    color: "rgb(50, 50, 51)",
    borderLeft: "1px solid rgb(223, 227, 232)", // Added border to create separation
  },
  downtimeStatus: {
    padding: "2px 8px",
    borderRadius: "4px",
    textTransform: "capitalize",
    color: "rgb(50, 50, 51)",
    fontFamily: "Inter, sans-serif",
    fontSize: "16px",
    fontWeight: "400",
    lineHeight: "20px",
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  snackbarMessage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginLeft: "30px",
  },
  deleteButton: {
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#757575",
    },
  },
};

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
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [toastOpen, setToastOpen] = useState(false);

  const handleSort = (key) => {
    const isAscending =
      sortConfig.key === key && sortConfig.direction === "asc";
    setSortConfig({ key, direction: isAscending ? "desc" : "asc" });
  };

  React.useEffect(() => {
    if (selectedAssets.length > 0) {
      setToastOpen(true);
    }
  }, [selectedAssets]);

  const handleSelect = (assetId) => {
    setSelectedAssets((prevSelected) => {
      const updatedSelected = prevSelected.includes(assetId)
        ? prevSelected.filter((id) => id !== assetId)
        : [...prevSelected, assetId];
      return updatedSelected;
    });
  };

  const handleRowClick = (event, asset) => {
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

  const handleDelete = async () => {
    try {
      for (const assetId of selectedAssets) {
        const response = await fetch(`http://localhost:5000/api/assets/${assetId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to delete asset with ID ${assetId}`);
        }
      }

      const remainingAssets = assets.filter(
        (asset) => !selectedAssets.includes(asset._id)
      );
      setAssets(remainingAssets);
      setSelectedAssets([]);
      setToastOpen(false);
    } catch (error) {
      console.error("Error deleting assets:", error);
    }
  };

  return (
    <div style={{ height: "100%", width: "100%", overflow: "auto" }}>
      <div style={styles.tableWrapper}> {/* Outer padding wrapper */}
        <TableContainer component={Paper} style={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow
              sx={{
                height: "32px", // Reduce header row height
                minHeight: "32px",
          
              }}
              >
                {selectedColumns.includes("name") && (
                  <TableCell
                  style={{
                    ...styles.tableHeaderCell,
                    paddingTop: "4px",
                    paddingBottom: "4px",
                  }}
                  >
                    <Checkbox
                      checked={selectedAssets.length === assets.length}
                      onChange={() => {
                        if (selectedAssets.length === assets.length) {
                          setSelectedAssets([]);
                        } else {
                          setSelectedAssets(assets.map((asset) => asset._id));
                        }
                      }}
                    />
                  </TableCell>
                )}
                {selectedColumns.includes("assetID") && (
                  <TableCell style={styles.tableHeaderCell}>
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
                  <TableCell style={styles.tableHeaderCell}>
                    Name
                  </TableCell>
                )}
                {selectedColumns.includes("manufacturer") && (
                  <TableCell
                    style={{
                      ...styles.tableHeaderCell,
                      borderLeft: "1px solid rgb(223, 227, 232)", // Added border to header as well
                    }}
                  >
                    Manufacturer
                  </TableCell>
                )}
                {selectedColumns.includes("serialNumber") && (
                  <TableCell style={styles.tableHeaderCell}>Serial Number</TableCell>
                )}
                {selectedColumns.includes("category") && (
                  <TableCell style={styles.tableHeaderCell}>Category</TableCell>
                )}
                {selectedColumns.includes("model") && (
                  <TableCell style={styles.tableHeaderCell}>Model</TableCell>
                )}
                {selectedColumns.includes("status") && (
                  <TableCell style={styles.tableHeaderCell}>Status</TableCell>
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
                      <TableCell style={styles.tableBodyCell}>
                        {index + 1 + page * rowsPerPage}
                      </TableCell>
                    )}
                    {selectedColumns.includes("name") && (
                      <TableCell style={styles.tableBodyCellName}>
                        {asset.name}
                      </TableCell>
                    )}
                    {selectedColumns.includes("manufacturer") && (
                      <TableCell style={styles.tableBodyCellManufacturer}>
                        {asset.manufacturer}
                      </TableCell>
                    )}
                    {selectedColumns.includes("serialNumber") && (
                      <TableCell style={styles.tableBodyCell}>{asset.serialNumber}</TableCell>
                    )}
                    {selectedColumns.includes("category") && (
                      <TableCell style={styles.tableBodyCell}>{asset.category}</TableCell>
                    )}
                    {selectedColumns.includes("model") && (
                      <TableCell style={styles.tableBodyCell}>{asset.model}</TableCell>
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
      </div>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message={
          <Box style={styles.snackbarMessage}>
            <Typography variant="body2" textAlign="center">
              {selectedAssets.length} selected
            </Typography>
            <Box display="flex" gap="12px" ml={2}>
              <Typography
                variant="body2"
                color="white"
                style={styles.deleteButton}
                onClick={handleDelete}
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
