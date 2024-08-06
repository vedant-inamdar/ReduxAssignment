import React from "react";
import "./LogTable.css";

const LogTable = ({ logs }) => {
  return (
    <div id="table">
      <table>
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>Sr No.</th>
            <th>Expression</th>
            <th>Valid</th>
            <th>Output</th>
            <th>Created On</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={log._id}>
              {/* <td>{log._id}</td> */}
              <td>{index + 1}</td>
              <td>{log.expression}</td>
              <td>{log.isValid ? "Yes" : "No"}</td>
              <td>{log.output !== null ? log.output : "N/A"}</td>
              <td>{new Date(log.createdOn).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogTable;
