// frontend/src/components/AssetOptions.jsx
import React from "react";
import { Button, Menu, MenuItem, Checkbox, ListItemText } from "@mui/material";

const AssetOptions = ({
  filteredOrders,
  assets,
  searchTerm,
  setSearchTerm,
  handleColumnClick,
  handleColumnClose,
  anchorEl,
  handleColumnSelect,
  selectedColumns,
}) => {
  return (
    <div
      className="filter-bar-top sc-dnqmqq gpQFPp"
      style={{
        width: "100%",
        padding: "8px 24px",
        backgroundColor: "white",
        margin: "0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: "20px",
      }}
    >
      <div
        className="text-left"
        style={{
          color: "rgb(50, 50, 51)", // Custom color
          fontSize: "13px", // Custom font size
          fontWeight: "bold", // Custom font weight
          lineHeight: "20px", // Custom line height
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI (Custom)', Roboto, 'Helvetica Neue', 'Open Sans (Custom)', system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'", 
        }}
      >
        {filteredOrders.length} of {assets.length} items
      </div>

      <div className="flex items-center gap-4">
        {/* Column */}
        <div className="flex items-center">
          <Button
            aria-controls="columns-menu"
            aria-haspopup="true"
            onClick={handleColumnClick}
            className="flex items-center gap-2 menu-list-btn bg-white px-2 py-1 rectangle-md hover:bg-gray-200"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "white",
              padding: "4px 8px",
              color: "rgb(50, 50, 51)", // Custom color
              fontSize: "13px", // Custom font size
              borderRadius: "4px", // rectangle-md equivalent
              fontFamily:
                "Inter, system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgb(229, 231, 235)", // hover:bg-gray-200
              },
            }}
          >
            <div
              className="icon-outer icon-before flex items-center"
              style={{ marginRight: "15px" }}
            >
              <div
                className="icon icon-columns icon-before"
                style={{ display: "inline-flex" }}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="-2 -2 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                >
                  <path
                    clipRule="evenodd"
                    d="M0 3a3 3 0 013-3h14a3 3 0 013 3v14a3 3 0 01-3 3H3a3 3 0 01-3-3V3zm3-1a1 1 0 00-1 1v3h4V2H3zm5 0v16h9a1 1 0 001-1V3a1 1 0 00-1-1H8zM6 18v-4H2v3a1 1 0 001 1h3zm-4-6h4V8H2v4z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
            <span
              className="text-sm font-medium"
              style={{
                color: "rgb(50, 50, 51)", // Custom color
                fontSize: "14px", // Custom font size
                lineHeight: "20px",
              }}
            >
              Columns
            </span>
          </Button>
          <Menu
            id="columns-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleColumnClose}
          >
            {[
              "name",
              "status",
              "model",
              "manufacturer",
              "category",
              "serialNumber",
            ].map((column) => (
              <MenuItem key={column} onClick={() => handleColumnSelect(column)}>
                <Checkbox checked={selectedColumns.includes(column)} />
                <ListItemText
                  primary={column.charAt(0).toUpperCase() + column.slice(1)}
                />
              </MenuItem>
            ))}
          </Menu>
        </div>

        {/* Divider */}
        <div
          className="sc-htpNat gkBrFJ"
          style={{
            width: "1px",
            background: "rgb(223, 227, 232)",

            height: "28px",
          }}
        ></div>

        {/* Search Component */}
        <div className="flex items-center bg-gray-100 rectangle-md px-2 py-1 focus-within:bg-white w-60">
          <div className="mr-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 26 26.001"
              fill="currentColor"
              className="text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M13.705 13.705a1 1 0 011.414 0l5.588 5.588a1 1 0 01-1.414 1.414l-5.588-5.588a1 1 0 010-1.414z"
              ></path>
              <path
                clipRule="evenodd"
                d="M10 5a5 5 0 100 10 5 5 0 000-10zm-7 5a7 7 0 1114 0 7 7 0 01-14 0z"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            className="w-full bg-transparent border-gray-300 text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:border-black"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default AssetOptions;
