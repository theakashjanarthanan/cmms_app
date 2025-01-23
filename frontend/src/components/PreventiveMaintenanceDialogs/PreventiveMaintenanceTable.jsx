import React from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper,
} from '@mui/material';

// Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function PreventiveMaintenanceTable({
  sortedPMs,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleViewClick,
  handleEditClick,
  handleDeleteClick,
  pms,
}) {
  return (
    <Box sx={{ width: "100%", marginTop: 4 }}>
      <TableContainer
        component={Paper}
        className="table-container shadow-xl rounded-xl mt-5 mb-5 p-8"
        sx={{ overflowX: "auto" }} // Horizontal scroll added
      >
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100 text-gray-700 font-semibold text-center">
              <TableCell className="font-semibold py-4 px-8">S No</TableCell>
              <TableCell className="font-semibold py-4 px-8">Display Name</TableCell>
              <TableCell className="font-semibold py-4 px-8">Title</TableCell>
              <TableCell className="font-semibold py-4 px-8">Asset Name</TableCell>
              <TableCell className="font-semibold py-4 px-8">Asset Location</TableCell>
              <TableCell className="font-semibold py-4 px-8">Category</TableCell>
              <TableCell className="font-semibold py-4 px-8">Worker</TableCell>
              <TableCell className="font-semibold py-4 px-8">Team</TableCell>
              <TableCell className="font-semibold py-4 px-8">Priority</TableCell>
              <TableCell className="font-semibold py-4 px-8">Date Created</TableCell>
              <TableCell className="font-semibold py-4 px-8">Date Updated</TableCell>
              <TableCell className="font-semibold py-4 px-8">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPMs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={12}
                  align="center"
                  className="no-data py-6"
                >
                  No preventive maintenance records available.
                </TableCell>
              </TableRow>
            ) : (
              sortedPMs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((pm, index) => (
                  <TableRow
                    key={pm._id}
                    className="hover:bg-gray-50 transition-all"
                    style={{ height: "70px" }} // Increased row height
                  >
                    <TableCell className="px-8 py-4 text-center font-medium">
                      {index + 1 + page * rowsPerPage}
                    </TableCell>
                    <TableCell className="px-8 py-4 font-medium">{pm.displayName}</TableCell>
                    <TableCell className="px-8 py-4 font-medium">{pm.title}</TableCell>
                    <TableCell className="px-8 py-4 font-medium">{pm.asset.name}</TableCell>
                    <TableCell className="px-8 py-4 font-medium">{pm.location}</TableCell>
                    <TableCell className="px-8 py-4 font-medium">{pm.category}</TableCell>
                    <TableCell className="px-8 py-4 font-medium">{pm.worker.fullName}</TableCell>
                    <TableCell className="px-8 py-4 font-medium">{pm.team.name}</TableCell>
                    <TableCell className="px-8 py-4 font-medium">{pm.priority}</TableCell>
                    <TableCell className="px-8 py-4 font-medium">
                      {new Date(pm.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-8 py-4 font-medium">
                      {new Date(pm.updatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-8 py-4">
                      <div className="flex justify-center gap-10">
                        <VisibilityIcon
                          className="action-icon view-icon text-blue-500"
                          sx={{ fontSize: 28 }} // Increased icon size
                          onClick={() => handleViewClick(pm._id)}
                        />
                        <EditIcon
                          className="action-icon edit-icon text-green-500"
                          sx={{ fontSize: 28 }} // Increased icon size
                          onClick={() => handleEditClick(pm)}
                        />
                        <DeleteIcon
                          className="action-icon delete-icon text-red-500"
                          sx={{ fontSize: 28 }} // Increased icon size
                          onClick={() => handleDeleteClick(pm._id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Table Pagination */}
      <TablePagination
        component="div"
        count={pms.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        className="pagination-container"
      />
    </Box>
  );
}

export default PreventiveMaintenanceTable;
