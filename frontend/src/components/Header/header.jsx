import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { MoreHorizontal } from "lucide-react"; 
// import { useNavigate } from "react-router-dom";

const Header = ({ title, toggleDrawer, buttonText, buttonAction }) => {
  // const navigate = useNavigate();

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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          flexGrow: 1,
        }}
      >
        {/* Toggle Sidebar */}
        <Button
          variant="text"
          sx={{
            padding: 0,
            minWidth: "auto",
            marginLeft: "15px",
            marginRight: "20px",
          }}
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
            marginTop: "5px",
            marginRight: "16px",
            fontSize: "20px",
            fontWeight: "600",
            color: "rgb(50, 50, 51);",
            lineHeight: "24px",
            fontFamily:
              "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI (Custom)', Roboto, 'Helvetica Neue', 'Open Sans (Custom)', system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
          }}
        >
          {title}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flexGrow: 1,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{
            height: "36px",
            width: "fit-content", // Adjusts the button width to fit content
            padding: "8px 16px",
            fontSize: "16px",
            lineHeight: "20px",
            fontWeight: "normal", // Ensures normal font weight
            backgroundColor: "rgb(12, 111, 249)", // Background color
            color: "rgb(255, 255, 255)", // Text color
            borderRadius: "4px", // Border radius
            textAlign: "center", // Text alignment in center
            display: "flex", // Flex display
            justifyContent: "center", // Centers the content
            alignItems: "center", // Aligns items in the center
            textTransform: "none", // Prevents text transformation (no uppercase)
            fontFamily:
              "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI (Custom)', Roboto, 'Helvetica Neue', 'Open Sans (Custom)', system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'", // Custom font family
            cursor: "pointer", // Makes the button clickable
            transition: "background-color 250ms", // Smooth background color transition
            marginRight: "50px",
            "&:hover": {
              backgroundColor: "rgb(12, 111, 249)", // Maintain color on hover
            },
          }}
          onClick={buttonAction}
        >
          {buttonText}
        </Button>

               {/* Three Dot Menu */}
       <div className="relative">
         <button className="p-2 pr-6 rounded-full hover:bg-white-200">
           <MoreHorizontal className="h-6 w-6 text-gray-600" />
         </button>
       </div>
 
      </Box>
    </Box>
  );
};

export default Header;
