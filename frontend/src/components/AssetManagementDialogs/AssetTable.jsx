import React, { useState } from "react"; // Importing React and useState hook for managing state
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
} from "@mui/material"; // Importing Material UI components for the table and pagination
import VisibilityIcon from "@mui/icons-material/Visibility"; // Importing the view icon
import EditIcon from "@mui/icons-material/Edit"; // Importing the edit icon
import DeleteIcon from "@mui/icons-material/Delete"; // Importing the delete icon

const AssetTable = ({ assets, onView, onEdit, onDelete }) => {
  // State for pagination (page number and rows per page)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for sorting configuration (key and direction of sorting)
  const [sortConfig, setSortConfig] = useState({ key: "assetID", direction: "desc" });

  // Handle sorting logic when the user clicks on the sorting icon in the header
  const handleSort = (key) => {
    const isAscending = sortConfig.key === key && sortConfig.direction === "asc";
    setSortConfig({ key, direction: isAscending ? "desc" : "asc" });
  };

  // Sort the assets based on the selected sorting configuration
  const sortedAssets = [...assets].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate the sorted assets based on current page and rows per page
  const paginatedAssets = sortedAssets.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle page change when user navigates to another page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle change in the number of rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10)); // Update the rows per page value
    setPage(0); // Reset to first page when rows per page is changed
  };

  return (
    <TableContainer
      component={Paper} // Table is wrapped inside a Paper component for styling
      className="table-container shadow-xl rounded-xl mt-5 mb-5 p-8"
      sx={{ overflowX: "auto" }} // Ensures horizontal scrolling when necessary
    >
      <Table>
        <TableHead>
          <TableRow className="bg-gray-100 text-gray-700 font-semibold text-center">
            {/* Table header with sortable columns */}
            <TableCell className="font-semibold py-4 px-8">
              <TableSortLabel
                active={sortConfig.key === "assetID"} // Set active sorting indicator
                direction={sortConfig.direction} // Set sorting direction
                onClick={() => handleSort("assetID")} // Call handleSort on click
              >
                SNO
              </TableSortLabel>
            </TableCell>
            {/* Other column headers */}
            <TableCell className="font-semibold py-4 px-8">Asset Name</TableCell>
            <TableCell className="font-semibold py-4 px-8">Manufacturer</TableCell>
            <TableCell className="font-semibold py-4 px-8">Serial Number</TableCell>
            <TableCell className="font-semibold py-4 px-8">Category</TableCell>
            <TableCell className="font-semibold py-4 px-8">Status</TableCell>
            <TableCell className="font-semibold py-4 px-8">Actions</TableCell> {/* Action buttons column */}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedAssets.length === 0 ? (
            <TableRow>
              {/* Display a message when no assets are available */}
              <TableCell colSpan={8} align="center" className="no-data py-6">
                No assets available.
              </TableCell>
            </TableRow>
          ) : (
            paginatedAssets.map((asset, index) => (
              <TableRow
                key={asset._id}
                className="hover:bg-gray-50 transition-all table-row"
                style={{ height: "70px" }}
              >
                <TableCell className="px-8 py-4 text-center font-medium">
                  {index + 1 + page * rowsPerPage} {/* Display the row index (SNO) */}
                </TableCell>
                {/* Display asset details in each column */}
                <TableCell className="px-8 py-4 font-medium">{asset.name}</TableCell>
                <TableCell className="px-8 py-4 font-medium">{asset.manufacturer}</TableCell>
                <TableCell className="px-8 py-4 font-medium">{asset.serialNumber}</TableCell>
                <TableCell className="px-8 py-4 font-medium">{asset.category}</TableCell>
                <TableCell className="px-8 py-4 font-medium">{asset.status}</TableCell>
                <TableCell className="px-8 py-4">
                  {/* Action icons for view, edit, and delete */}
                  <div className="flex justify-center gap-10">
                    <VisibilityIcon
                      className="action-icon view-icon text-blue-500"
                      sx={{ fontSize: 28 }}
                      onClick={() => onView(asset)} // View action
                    />
                    <EditIcon
                      className="action-icon edit-icon text-green-500"
                      sx={{ fontSize: 28 }}
                      onClick={() => onEdit(asset)} // Edit action
                    />
                    <DeleteIcon
                      className="action-icon delete-icon text-red-500"
                      sx={{ fontSize: 28 }}
                      onClick={() => onDelete(asset._id)} // Use _id here
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Table Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]} // Options for how many rows per page
        component="div"
        count={assets.length} // Total number of assets
        rowsPerPage={rowsPerPage} // Number of rows to display per page
        page={page} // Current page
        onPageChange={handleChangePage} // Handle page change
        onRowsPerPageChange={handleChangeRowsPerPage} // Handle rows per page change
        className="pagination-container"
      />
    </TableContainer>
  );
};

export default AssetTable;
