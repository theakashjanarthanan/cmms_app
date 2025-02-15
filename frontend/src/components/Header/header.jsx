import React, { useState } from "react";
import { Box, Button, Typography, Menu, MenuItem, IconButton, Tabs, Tab } from "@mui/material";
import { MoreHorizontal } from "lucide-react"; // Ensure you're using lucide-react for the MoreHorizontal icon

const Header = ({
  title,
  toggleDrawer,
  buttonText,
  buttonAction,
  menuItems,
  tabs,
  selectedTab,
  handleTabChange,
  children,
}) => {
  const [anchorEl, setAnchorEl] = useState(null); // State for the three-dot menu

  // Open the Menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the Menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = () => {
    toggleDrawer(false); // Close the sidebar when clicking the menu
  };

  return (
    <Box
      sx={{
        fontFamily: 'Lato, "Open Sans", sans-serif',
        fontWeight: "400",
        lineHeight: "20px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        height: "60px",
        backgroundColor: "rgb(255, 255, 255)",
        width: "100%",
        borderBottom: "1px solid rgb(229, 229, 234)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
        {/* Toggle Sidebar */}
        <Button
          variant="text"
          sx={{ padding: 0, minWidth: "auto", marginRight: "30px", marginLeft: "30px" }}
          onClick={handleMenuClick} // Close the sidebar when clicking the menu
        >
          <svg
            width="24"
            height="24"
            viewBox="28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            strokeWidth="0"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7 7c-.666 0-1 .456-1 .778v12.444c0 .322.334.778 1 .778h14c.666 0 1-.456 1-.778V7.778C22 7.456 21.666 7 21 7H7zm-3 .778C4 6.136 5.457 5 7 5h14c1.543 0 3 1.136 3 2.778v12.444C24 21.864 22.543 23 21 23H7c-1.543 0-3-1.136-3-2.778V7.778z"
              fill="#B8B8B8"
            />
            <path
              d="M12 6v16M8 10h1M8 13h1"
              stroke="#B8B8B8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>

        <Box
          sx={{
            height: "60px",
            width: "1px",
            backgroundColor: "rgb(229, 229, 234)",
            marginRight: "20px",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            marginRight: "16px",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          {title}
        </Typography>

        {/* Dynamically add Tabs next to the title */}
        {tabs && (
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="dynamic tabs"
            sx={{ marginLeft: "16px" }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab} />
            ))}
          </Tabs>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flexGrow: 1 }}>
        {/* Action Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{
            height: "36px",
            padding: "8px 16px",
            fontSize: "16px",
            lineHeight: "20px",
            fontWeight: "normal",
            backgroundColor: "rgb(12, 111, 249)",
            color: "rgb(255, 255, 255)",
            borderRadius: "4px",
            textTransform: "none",
            cursor: "pointer",
            transition: "background-color 250ms",
            marginRight: "20px",
            "&:hover": { backgroundColor: "rgb(10, 100, 230)" },
          }}
          onClick={buttonAction}
        >
          {buttonText}
        </Button>

        {/* Three-Dot Menu Button */}
        <IconButton onClick={handleMenuOpen}>
          <MoreHorizontal className="h-6 w-6 text-gray-600" />
        </IconButton>

        {/* Dropdown Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {menuItems && menuItems.map((item, index) => (
            <MenuItem key={index} onClick={() => { item.onClick(); handleMenuClose(); }}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      {/* Render the children passed to the Header */}
      {children}
    </Box>
  );
};

export default Header;
