import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import "./LogTable.css";

const NewLogTable = ({ refresh, onDelete }) => {
  // State to hold the full list of logs
  const [logs, setLogs] = useState([]);
  // State to hold all fetched logs
  const [allLogs, setAllLogs] = useState([]);
  // State to track selected row IDs
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // State to hold filter criteria
  const [filters, setFilters] = useState({});
  // State to manage current page and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  // State to manage which search inputs are active
  const [searchStates, setSearchStates] = useState({
    expression: false,
    isValid: false,
    output: false,
    createdOn: false,
  });

  // Fetch logs when the component mounts or refresh is triggered
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/logs", {
          params: {
            page: 1,
            limit: 10000,
          },
        });
        setAllLogs(res.data.logs || []);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, [refresh]);

  // Filter logs based on the current filters
  useEffect(() => {
    const filtered = allLogs.filter((log) =>
      Object.keys(filters).every((key) => {
        if (!filters[key]) return true;
        if (key === "isValid") {
          return log[key] === (filters[key] === "yes" ? true : false);
        }
        if (key === "output") {
          const filterValue = parseFloat(filters[key]);
          const logValue = parseFloat(log[key]);
          return !isNaN(filterValue)
            ? logValue === filterValue
            : (log[key] || "").toLowerCase().includes(filters[key]);
        }
        if (key === "createdOn") {
          const filterValue = filters[key];
          const logDate = new Date(log[key]);
          const logDateStr = logDate.toLocaleDateString();
          return logDateStr.includes(filterValue);
        }
        return (log[key] || "").toString().toLowerCase().includes(filters[key]);
      })
    );
    setLogs(filtered);
    setTotal(filtered.length);
    setCurrentPage(1);
  }, [filters, allLogs]);

  // Handle changes to filter inputs
  const handleFilterChange = (value, key) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value.toLowerCase(),
    }));
  };

  // Handle log deletion
  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8080/api/logs", {
        data: { ids: selectedRowKeys },
      });
      setSelectedRowKeys([]);
      alert("Logs deleted successfully");
      onDelete();
    } catch (error) {
      console.error("Error deleting logs:", error);
      alert("Error deleting logs");
    }
  };

  // Handle page changes for pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle selection of all rows on the current page
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const newSelectedRowKeys = checked
      ? paginatedLogs.map((log) => log._id)
      : [];
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // Handle individual row selection
  const handleCheckboxChange = (e, logId) => {
    const checked = e.target.checked;
    const newSelectedRowKeys = checked
      ? [...selectedRowKeys, logId]
      : selectedRowKeys.filter((key) => key !== logId);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // Get logs for the current page
  const paginatedLogs = logs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate total number of pages for pagination
  const totalPages = Math.ceil(total / pageSize);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Determine which page numbers to display in pagination
  const getVisiblePageNumbers = () => {
    const maxPagesToShow = 5; // Number of page buttons to display at once
    const pages = [];
    const halfMaxPages = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, currentPage - halfMaxPages);
    let end = Math.min(totalPages, currentPage + halfMaxPages);

    if (currentPage - halfMaxPages < 1) {
      end = Math.min(maxPagesToShow, totalPages);
    }

    if (currentPage + halfMaxPages > totalPages) {
      start = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    if (start > 1) pages.push(1);
    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("...");
    if (end < totalPages) pages.push(totalPages);

    return pages;
  };

  // Toggle the visibility of search input fields
  const toggleSearchInput = (key) => {
    setSearchStates((prev) => ({
      ...Object.keys(prev).reduce((acc, currentKey) => {
        acc[currentKey] = currentKey === key ? !prev[currentKey] : false;
        return acc;
      }, {}),
    }));
  };

  return (
    <div id="table">
      <div className="actions">
        <button
          type="button"
          onClick={handleDelete}
          disabled={selectedRowKeys.length === 0}
        >
          Delete Selected
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  selectedRowKeys.length === paginatedLogs.length &&
                  paginatedLogs.length > 0
                }
              />
            </th>
            <th>
              Expression
              <div
                className={`search-container ${
                  searchStates.expression ? "active" : ""
                }`}
              >
                <FaSearch
                  className="search-icon"
                  onClick={() => toggleSearchInput("expression")}
                />
                {searchStates.expression && (
                  <input
                    placeholder="Filter"
                    onChange={(e) =>
                      handleFilterChange(e.target.value, "expression")
                    }
                  />
                )}
              </div>
            </th>
            <th>
              Valid
              <div
                className={`search-container ${
                  searchStates.isValid ? "active" : ""
                }`}
              >
                <FaSearch
                  className="search-icon"
                  onClick={() => toggleSearchInput("isValid")}
                />
                {searchStates.isValid && (
                  <input
                    placeholder="Filter (yes/no)"
                    onChange={(e) =>
                      handleFilterChange(e.target.value, "isValid")
                    }
                  />
                )}
              </div>
            </th>
            <th>
              Output
              <div
                className={`search-container ${
                  searchStates.output ? "active" : ""
                }`}
              >
                <FaSearch
                  className="search-icon"
                  onClick={() => toggleSearchInput("output")}
                />
                {searchStates.output && (
                  <input
                    placeholder="Filter"
                    onChange={(e) =>
                      handleFilterChange(e.target.value, "output")
                    }
                  />
                )}
              </div>
            </th>
            <th>
              Created
              <div
                className={`search-container ${
                  searchStates.createdOn ? "active" : ""
                }`}
              >
                <FaSearch
                  className="search-icon"
                  onClick={() => toggleSearchInput("createdOn")}
                />
                {searchStates.createdOn && (
                  <input
                    placeholder="Filter (e.g., 8/13)"
                    onChange={(e) =>
                      handleFilterChange(e.target.value, "createdOn")
                    }
                  />
                )}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedLogs.map((log) => (
            <tr key={log._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRowKeys.includes(log._id)}
                  onChange={(e) => handleCheckboxChange(e, log._id)}
                />
              </td>
              <td>{log.expression}</td>
              <td>{log.isValid ? "Yes" : "No"}</td>
              <td>{log.output}</td>
              <td>{new Date(log.createdOn).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {getVisiblePageNumbers().map((page, index) => (
          <div
            key={index}
            className={`page-number ${page === currentPage ? "active" : ""}`}
          >
            {page === "..." ? (
              <span>{page}</span>
            ) : (
              <button onClick={() => handlePageChange(page)}>{page}</button>
            )}
          </div>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default NewLogTable;
