import React  from "react";
import { Divider} from "@mui/material";

const DataToolbar = ({
  filteredItems,
  totalItems,
  searchTerm,
  setSearchTerm,
  title = "Items",
}) => {

  const inputStyle = {
    width: "200px",
    padding: "4px 8px",
    fontSize: "13px",
    backgroundColor: "rgb(243, 244, 246)",
    borderRadius: "4px",
  };

  const separatorStyle = {
    width: "1px",
    height: "24px",
    backgroundColor: "#E5E7EB",
    margin: "0 8px",
  };

  return (
    <div>
      <div
        className="filter-bar-top"
        style={{
          width: "100%",
          padding: "6px 20px",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Item Count */}
        <div className="text-left text-gray-600 text-sm font-bold">
          {filteredItems.length} of {totalItems} {title}
        </div>

        <div className="flex items-center gap-3">
          <Divider />
          {/* Separator */}
          <div style={separatorStyle}></div>

          {/* Search Bar */}
          <div className="flex items-center" style={inputStyle}>
            <div className="mr-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 26 26"
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
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Thin Grey Line Below */}
      <div style={{ borderBottom: "1px solid #E5E7EB" }}></div>
    </div>
  );
};

export default DataToolbar;
