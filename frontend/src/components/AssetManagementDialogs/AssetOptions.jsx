// frontend/src/components/AssetFilter.jsx
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
  selectedColumns 
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
      <div className="text-left text-gray-600 text-sm font-medium">
        {filteredOrders.length} of {assets.length} item
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <Button
            aria-controls="columns-menu"
            aria-haspopup="true"
            onClick={handleColumnClick}
            className="flex items-center gap-2 bg-white text-gray-700 px-2 py-1 rectangle-md hover:bg-gray-200"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <path
                d="M3 3h6v6H3V3zM15 3h6v6h-6V3zM3 15h6v6H3v-6zM15 15h6v6h-6v-6z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium">Columns</span>
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
                <ListItemText primary={column.charAt(0).toUpperCase() + column.slice(1)} />
              </MenuItem>
            ))}
          </Menu>
        </div>
        <div
          style={{
            width: "1px",
            height: "30px",
            backgroundColor: "#E5E7EB",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        ></div>
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
              <path clipRule="evenodd" d="M13.705 13.705a1 1 0 011.414 0l5.588 5.588a1 1 0 01-1.414 1.414l-5.588-5.588a1 1 0 010-1.414z"></path>
              <path clipRule="evenodd" d="M10 5a5 5 0 100 10 5 5 0 000-10zm-7 5a7 7 0 1114 0 7 7 0 01-14 0z"></path>
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
