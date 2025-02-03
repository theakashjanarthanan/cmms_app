import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

import Sidebar from "../components/Sidebar";
import { fetchUsers, fetchTeams } from "../api/api"; // Import API
import Teams from "../components/PeoplesandTeams/Teams";
import Peoples from "../components/PeoplesandTeams/Peoples";
import Header from "../components/Header/header";
import DataToolbar from "../components/PeoplesandTeams/DataToolBar";

const PeoplesAndTeamPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const sidebarWidth = isSidebarMinimized ? 5 : 250;
  const [selectedTab, setSelectedTab] = useState(0);

  // Toolbar states
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState(["fullName", "email", "role"]);
  const availableColumns = ["fullName", "email", "role"];
  const [selectedAccountType, setSelectedAccountType] = useState("Account Type");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await fetchUsers();
        const sortedUsers = usersData.sort((a, b) => b._id.localeCompare(a._id));
        setUsers(sortedUsers);
        setFilteredUsers(sortedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    const getTeams = async () => {
      try {
        const teamsData = await fetchTeams();
        setTeams(teamsData);
        setFilteredTeams(teamsData);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };

    getUsers();
    getTeams();
  }, []);

  useEffect(() => {
    if (selectedAccountType !== "Account Type") {
      setFilteredUsers(
        users.filter(user => user.accountType === selectedAccountType)
      );
    } else {
      setFilteredUsers(users); // If no account type is selected, show all users
    }
  }, [selectedAccountType, users]);

  // Handle search filtering
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);

    if (selectedTab === 0) {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredTeams(
        teams.filter(
          (team) =>
            team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  // Handle tab change
  const handleTabChange = (event, newTab) => setSelectedTab(newTab);

  // Toggle sidebar state
  const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);

  // Column selection handlers
  const handleColumnClick = (event) => setAnchorEl(event.currentTarget);
  const handleColumnClose = () => setAnchorEl(null);
  const handleColumnSelect = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column]
    );
  };

  // Handle account type change from DataToolbar
  const handleAccountTypeChange = (accountType) => {
    setSelectedAccountType(accountType);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar isMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} />

      <Box
        sx={{
          flexGrow: 1,
          ml: `${sidebarWidth}px`,
          transition: "margin-left 0.3s ease",
          p: 3,
        }}
      >
        {/* Header Component */}
        <Header
          title={selectedTab === 0 ? "People" : "Teams"}
          tabs={["People", "Teams"]}
          selectedTab={selectedTab}
          handleTabChange={handleTabChange}
          toggleDrawer={toggleSidebar}
          buttonText={selectedTab === 0 ? "Add People" : "Add Team"}
          buttonAction={() => (selectedTab === 0 ? setOpenAddDialog(true) : setOpenDialog(true))}
          sx={{ padding: "0" }}
        />

        {/* DataToolbar Component */}
        <DataToolbar
          filteredItems={selectedTab === 0 ? filteredUsers : filteredTeams}
          totalItems={selectedTab === 0 ? users.length : teams.length}
          searchTerm={searchTerm}
          setSearchTerm={handleSearch}
          handleColumnClick={handleColumnClick}
          handleColumnClose={handleColumnClose}
          anchorEl={anchorEl}
          handleColumnSelect={handleColumnSelect}
          selectedColumns={selectedColumns}
          availableColumns={availableColumns}
          title={selectedTab === 0 ? "Users" : "Teams"} // Ensure correct title
          selectedAccountType={selectedAccountType} // Pass selected account type
          setSelectedAccountType={handleAccountTypeChange} // Pass function to handle changes
          sx={{ padding: "0" }}
        />

        {/* Display Content Based on Selected Tab */}
        {selectedTab === 0 ? (
          <Peoples
            selectedAccountType={selectedAccountType} // Pass selectedAccountType to Peoples component
            searchTerm={searchTerm}
            openAddDialog={openAddDialog}
            handleCloseAddDialog={() => setOpenAddDialog(false)}
          />
        ) : (
          <Teams
            searchTerm={searchTerm}
            openDialog={openDialog}
            handleCloseDialog={() => setOpenDialog(false)}
          />
        )}
      </Box>
    </Box>
  );
};

export default PeoplesAndTeamPage;
