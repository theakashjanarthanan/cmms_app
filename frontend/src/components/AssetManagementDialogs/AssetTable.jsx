// frontend/src/components/AssetTable.jsx

import React from "react";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AssetTable = ({
  assets,
  paginatedAssets,
  page,
  rowsPerPage,
  sortConfig,
  handleSort,
  handleViewDialogOpen,
  handleDialogOpen,
  handleDeleteDialogOpen,
  handleChangePage,
  handleChangeRowsPerPage
}) => {
  return (
    <TableContainer
      component={Paper}
      className="table-container shadow-xl rounded-xl mt-5 mb-5 p-8"
      sx={{ overflowX: "auto" }}
    >
      <Table>
        <TableHead>
          <TableRow className="bg-gray-100 text-gray-700 font-semibold text-center">
            <TableCell className="font-semibold py-4 px-8">
              <TableSortLabel
                active={sortConfig.key === "assetID"}
                direction={sortConfig.direction}
                onClick={() => handleSort("assetID")}
              >
                SNO
              </TableSortLabel>
            </TableCell>
            <TableCell className="font-semibold py-4 px-8">
              <TableSortLabel
                active={sortConfig.key === "assetID"}
                direction={sortConfig.direction}
                onClick={() => handleSort("assetID")}
              >
                AS ID
              </TableSortLabel>
            </TableCell>
            <TableCell className="font-semibold py-4 px-8">
              Asset Name
            </TableCell>
            <TableCell className="font-semibold py-4 px-8">
             Manufacturer
            </TableCell>
            <TableCell className="font-semibold py-4 px-8">
              Serial Number
            </TableCell>
            <TableCell className="font-semibold py-4 px-8">Category</TableCell>
            <TableCell className="font-semibold py-4 px-8">Status</TableCell>
            <TableCell className="font-semibold py-4 px-8">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedAssets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" className="no-data py-6">
                No assets available.
              </TableCell>
            </TableRow>
          ) : (
            paginatedAssets.map((asset, index) => (
              <TableRow
                key={asset.assetID}
                className="hover:bg-gray-50 transition-all table-row"
                style={{ height: "70px" }}
              >
                <TableCell className="px-8 py-4 text-center font-medium">
                  {index + 1 + page * rowsPerPage}
                </TableCell>
                <TableCell className="px-8 py-4 font-medium">
                  {asset.assetID}
                </TableCell>
                <TableCell className="px-8 py-4 font-medium">
                  {asset.name}
                </TableCell>
                <TableCell className="px-8 py-4 font-medium">
                  {asset.manufacturer}
                </TableCell>
                <TableCell className="px-8 py-4 font-medium">
                  {asset.serialNumber}
                </TableCell>
                <TableCell className="px-8 py-4 font-medium">
                  {asset.category}
                </TableCell>
                <TableCell className="px-8 py-4 font-medium">
                  {asset.status}
                </TableCell>
                <TableCell className="px-8 py-4">
                  <div className="flex justify-center gap-10">
                    <VisibilityIcon
                      className="action-icon view-icon text-blue-500"
                      sx={{ fontSize: 28 }}
                      onClick={() => handleViewDialogOpen(asset)}
                    />
 
                      <>
                        <EditIcon
                          className="action-icon edit-icon text-green-500"
                          sx={{ fontSize: 28 }}
                          onClick={() => handleDialogOpen(asset)}
                        />
                        <DeleteIcon
                          className="action-icon delete-icon text-red-500"
                          sx={{ fontSize: 28 }}
                          onClick={() => handleDeleteDialogOpen(asset.assetID)}
                        />
                      </>

                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Table Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={assets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        className="pagination-container"
      />
    </TableContainer>
  );
};

export default AssetTable;
