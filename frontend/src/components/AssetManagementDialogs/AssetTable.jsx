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
} from "@mui/material";


const AssetTable = ({ assets, onView, selectedColumns, selectedStatus }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "assetID", direction: "asc" });

  const handleSort = (key) => {
    const isAscending = sortConfig.key === key && sortConfig.direction === "asc";
    setSortConfig({ key, direction: isAscending ? "desc" : "asc" });
  };

  const filteredAssets = assets.filter((asset) =>
    selectedStatus ? asset.status === selectedStatus : true
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
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) =>
    setRowsPerPage(parseInt(event.target.value, 10));

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
              {selectedColumns.includes("assetID") && (
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === "assetID"}
                    direction={sortConfig.direction}
                    onClick={() => handleSort("assetID")}
                  >
                    SNO
                  </TableSortLabel>
                </TableCell>
              )}
              {selectedColumns.includes("name") && <TableCell>Asset Name</TableCell>}
              {selectedColumns.includes("manufacturer") && <TableCell>Manufacturer</TableCell>}
              {selectedColumns.includes("serialNumber") && <TableCell>Serial Number</TableCell>}
              {selectedColumns.includes("category") && <TableCell>Category</TableCell>}
              {selectedColumns.includes("model") && <TableCell>Model</TableCell>}
              {selectedColumns.includes("status") && <TableCell>Status</TableCell>}
            
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAssets.length === 0 ? (
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
                  onClick={() => onView(asset)}
                  style={{ cursor: "pointer" }}
                >
                  {selectedColumns.includes("assetID") && (
                    <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                  )}
                  {selectedColumns.includes("name") && <TableCell>{asset.name}</TableCell>}
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
                    <TableCell>{asset.status}</TableCell>
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
  );
};

export default AssetTable;
