//User specific-logs

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import "./LogTable.css";

const NewLogTable = ({ refresh, onDelete }) => {
  const [logs, setLogs] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filters, setFilters] = useState({
    expression: "",
    isValid: "",
    output: "",
    createdOn: "",
    id: "", // ID filter
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchStates, setSearchStates] = useState({
    expression: false,
    isValid: false,
    output: false,
    createdOn: false,
    id: false, // ID search input state
  });

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/logs", {
          params: {
            page: 1,
            limit: 10000,
          },
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        setAllLogs(res.data.logs || []);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, [refresh]);

  useEffect(() => {
    const filtered = allLogs.filter((log) => {
      return Object.keys(filters).every((key) => {
        if (!filters[key]) return true;

        const logValue =
          key === "id"
            ? typeof log._id === "string"
              ? log._id
              : ""
            : log[key];

        const logValueStr = (logValue || "").toString().toLowerCase();
        const filterValue = (filters[key] || "").toLowerCase();

        if (key === "isValid") {
          const logIsValid = log[key] ? "yes" : "no";
          return logIsValid.includes(filterValue);
        }
        if (key === "output") {
          const filterValueNum = parseFloat(filterValue);
          const logValueNum = parseFloat(logValueStr);
          return !isNaN(filterValueNum)
            ? logValueNum === filterValueNum
            : logValueStr.includes(filterValue);
        }
        if (key === "createdOn") {
          const filterValueDateTime = filterValue;
          const logDateTime = new Date(log[key]);
          const logDateTimeStr = logDateTime.toLocaleString();
          return logDateTimeStr.includes(filterValueDateTime);
        }
        return logValueStr.includes(filterValue);
      });
    });

    setLogs(filtered);
    setTotal(filtered.length);
    setCurrentPage(1);
  }, [filters, allLogs]);

  const handleFilterChange = (value, key) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value.toLowerCase(),
    }));
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8080/api/logs", {
        data: { ids: selectedRowKeys },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setSelectedRowKeys([]);
      alert("Logs deleted successfully");
      onDelete();
    } catch (error) {
      console.error("Error deleting logs:", error);
      alert("Error deleting logs");
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > Math.ceil(total / pageSize)) return;
    setCurrentPage(page);
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const newSelectedRowKeys = checked
      ? paginatedLogs.map((log) => log._id)
      : [];
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleCheckboxChange = (e, logId) => {
    const checked = e.target.checked;
    const newSelectedRowKeys = checked
      ? [...selectedRowKeys, logId]
      : selectedRowKeys.filter((key) => key !== logId);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const paginatedLogs = logs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(total / pageSize);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getVisiblePageNumbers = () => {
    const maxPagesToShow = 5;
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
              ID
              <div
                className={`search-container ${
                  searchStates.id ? "active" : ""
                }`}
              >
                <FaSearch
                  className="search-icon"
                  onClick={() => toggleSearchInput("id")}
                />
                {searchStates.id && (
                  <input
                    placeholder="Filter by ID"
                    onChange={(e) => handleFilterChange(e.target.value, "_id")}
                  />
                )}
              </div>
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
                    placeholder="Filter by Valid"
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
              Created On
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
                    placeholder="Filter"
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
          {paginatedLogs.length > 0 ? (
            paginatedLogs.map((log) => (
              <tr key={log._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRowKeys.includes(log._id)}
                    onChange={(e) => handleCheckboxChange(e, log._id)}
                  />
                </td>
                <td>{log._id}</td>
                {/* <td>{log.userId}</td> */}
                <td>{log.expression}</td>
                <td>{log.isValid ? "Yes" : "No"}</td>
                <td>{log.output}</td>
                <td>{new Date(log.createdOn).toLocaleString()}</td>{" "}
                {/* Updated to include time */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No logs found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {getVisiblePageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={index}>...</span>
          ) : (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? "active" : ""}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewLogTable;
