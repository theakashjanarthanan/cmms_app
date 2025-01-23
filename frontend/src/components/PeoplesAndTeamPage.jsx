// frontend/src/components/PeoplesAndTeamPage.jsx

import React, { useEffect, useState } from "react";
import {
  Stack,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Tabs,
  Tab,
} from "@mui/material";

import Sidebar from "./Sidebar"; // Import Sidebar
import { fetchUsers } from "../api/api"; // Import API
import TeamsPage from "./TeamsPage"; // Import the TeamsPage Component

const PeoplesAndTeamPage = () => {
  const [users, setUsers] = useState([]);

  // Pagination States
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Records per page
  const [selectedTab, setSelectedTab] = useState(0); // State to manage selected tab

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await fetchUsers();
        // Sort users by MongoDB _id (newest first)
        const sortedUsers = usersData.sort((a, b) =>
          b._id.localeCompare(a._id),
        );
        setUsers(sortedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    getUsers();
  }, []);

  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  // Handle tab change
  const handleTabChange = (event, newTab) => {
    setSelectedTab(newTab);
  };

  // Calculate the current page's data
  const paginatedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar Component */}
      <Sidebar />

      <Box sx={{ flexGrow: 1, ml: "250px", p: 3 }}>
        {/* Tabs for Peoples and Teams */}
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="Peoples and Teams tabs"
        >
          <Tab label="Peoples" />
          <Tab label="Teams" />
        </Tabs>

        {/* Display Content Based on Selected Tab */}
        {selectedTab === 0 ? (
          <div>
            <Stack spacing={2} sx={{ padding: 2 }}>
              <Typography variant="h4">Welcome to the Peoples page!</Typography>
            </Stack>

            {/* Table to Display Peoples */}
            <>
              <TableContainer
                component={Paper}
                sx={{
                  mt: 4,
                  overflowX: "auto",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow className="bg-gray-100 text-gray-700 font-semibold text-center">
                      <TableCell className="font-semibold">S No</TableCell>
                      <TableCell className="font-semibold">Full Name</TableCell>
                      <TableCell className="font-semibold">Email</TableCell>
                      <TableCell className="font-semibold">Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          align="center"
                          sx={{ fontStyle: "bold", color: "gray" }}
                        >
                          No users available.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedUsers.map((user, index) => (
                        <TableRow
                          key={user._id}
                          className="hover:bg-gray-50 transition-all table-row"
                        >
                          <TableCell className="px-6 py-3 text-center font-medium">
                            {page * rowsPerPage + index + 1}
                          </TableCell>
                          <TableCell className="px-6 py-3 font-medium">
                            {user.fullName}
                          </TableCell>
                          <TableCell className="px-6 py-3 font-medium">
                            {user.email}
                          </TableCell>
                          <TableCell className="px-6 py-3 font-medium">
                            {user.role}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <TablePagination
                  rowsPerPageOptions={[5, 10, 20]}
                  component="div"
                  count={users.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  className="pagination-container"
                />
              </TableContainer>
            </>
          </div>
        ) : (
          // Render TeamsPage Component when Teams tab is selected
          <TeamsPage />
        )}
      </Box>
    </Box>
  );
};

export default PeoplesAndTeamPage;
