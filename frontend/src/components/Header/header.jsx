import React, { useState } from "react";
import { Box, Button, Typography, Menu, MenuItem, IconButton } from "@mui/material";
import { MoreHorizontal } from "lucide-react";

const Header = ({ title, toggleDrawer, buttonText, buttonAction, menuItems }) => {
  const [anchorEl, setAnchorEl] = useState(null); // State for the three-dot menu

  const handleMenuClick = () => {
    toggleDrawer((prev) => !prev); // Toggle sidebar open/close
  };

  // Open the Menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the Menu
  const handleMenuClose = () => {
    setAnchorEl(null);
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
      {/* Left side: Sidebar Toggle & Title */}
      <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
        <Button
          variant="text"
          sx={{ padding: 0, minWidth: "auto", marginLeft: "15px", marginRight: "20px" }}
          onClick={handleMenuClick}
        >
          {/* Sidebar Toggle Icon */}
          <svg width="24" height="24" viewBox="28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7 7c-.666 0-1 .456-1 .778v12.444c0 .322.334.778 1 .778h14c.666 0 1-.456 1-.778V7.778C22 7.456 21.666 7 21 7H7zm-3 .778C4 6.136 5.457 5 7 5h14c1.543 0 3 1.136 3 2.778v12.444C24 21.864 22.543 23 21 23H7c-1.543 0-3-1.136-3-2.778V7.778z"
              fill="#B8B8B8"
            />
            <path d="M12 6v16M8 10h1M8 13h1" stroke="#B8B8B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>

        {/* Vertical Divider */}
        <Box sx={{ height: "60px", width: "1px", backgroundColor: "rgb(229, 229, 234)", marginRight: "20px" }} />

        {/* Page Title */}
        <Typography
          variant="h6"
          sx={{
            marginTop: "5px",
            marginRight: "16px",
            fontSize: "20px",
            fontWeight: "600",
            color: "rgb(50, 50, 51)",
            lineHeight: "24px",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Open Sans', sans-serif",
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Right side: Action Button & Menu */}
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

        {/* Dropdown Menu*/}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {menuItems && menuItems.map((item, index) => (
            <MenuItem key={index} onClick={() => { item.onClick(); handleMenuClose(); }}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;
