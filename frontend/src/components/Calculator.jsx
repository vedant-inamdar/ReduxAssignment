import React, { useState } from "react";
import axios from "axios";
import "./Calculator.css";
import NewLogTable from "./NewLogTable";

const Calculator = () => {
  // State to manage the current expression displayed on the calculator
  const [expression, setExpression] = useState("");
  // State to trigger a refresh of the logs in NewLogTable component
  const [refreshLogs, setRefreshLogs] = useState(false);

  // Function to handle button clicks
  const handleClick = (value) => {
    if (!isNaN(value) || value === ".") {
      // If the value is a number or a decimal point, add it to the expression
      setExpression((prev) => prev + value);
    } else if (value === "AC") {
      // If "AC" is clicked, clear the expression
      setExpression("");
    } else if (value === "DEL") {
      // If "DEL" is clicked, remove the last character from the expression
      setExpression((prev) => prev.slice(0, -1));
    } else if (value === "=") {
      // If "=" is clicked, evaluate the expression
      evaluate();
    } else {
      // If an operator is clicked and the last character is a number, add the operator
      if (expression && !isNaN(expression.slice(-1))) {
        setExpression((prev) => prev + value);
      }
    }
  };

  // Function to evaluate the expression and handle API calls
  const evaluate = async () => {
    try {
      // Evaluate the expression using JavaScript's eval function
      const res = eval(expression);
      setExpression(res.toString()); // Update the expression with the result
      // Log the valid expression and result to the backend
      await axios.post("http://localhost:8080/api/logs", {
        expression: expression,
        isValid: true,
        output: res,
      });
      // Trigger a refresh of the logs in NewLogTable component
      setRefreshLogs((prev) => !prev);
    } catch (error) {
      // If there's an error in evaluation, display "Error"
      setExpression("Error");
      // Log the invalid expression attempt to the backend
      await axios.post("http://localhost:8080/api/logs", {
        expression: expression,
        isValid: false,
        output: null,
      });
      // Trigger a refresh of the logs in NewLogTable component
      setRefreshLogs((prev) => !prev);
    }
  };

  return (
    <div className="holder">
      <div className="calculator">
        <div className="display">
          {/* Display the current expression */}
          <input
            type="text"
            className="display-input"
            value={expression}
            readOnly
          />
        </div>
        <div className="buttons">
          {/* Calculator buttons with onClick handlers */}
          <button className="button operator" onClick={() => handleClick("AC")}>
            AC
          </button>
          <button className="button operator" onClick={() => handleClick("%")}>
            %
          </button>
          <button
            className="button operator"
            onClick={() => handleClick("DEL")}
          >
            <span className="material-symbols-outlined">backspace</span>
          </button>
          <button className="button operator" onClick={() => handleClick("/")}>
            /
          </button>
          <button className="button" onClick={() => handleClick("7")}>
            7
          </button>
          <button className="button" onClick={() => handleClick("8")}>
            8
          </button>
          <button className="button" onClick={() => handleClick("9")}>
            9
          </button>
          <button className="button operator" onClick={() => handleClick("*")}>
            *
          </button>
          <button className="button" onClick={() => handleClick("4")}>
            4
          </button>
          <button className="button" onClick={() => handleClick("5")}>
            5
          </button>
          <button className="button" onClick={() => handleClick("6")}>
            6
          </button>
          <button className="button operator" onClick={() => handleClick("-")}>
            -
          </button>
          <button className="button" onClick={() => handleClick("1")}>
            1
          </button>
          <button className="button" onClick={() => handleClick("2")}>
            2
          </button>
          <button className="button" onClick={() => handleClick("3")}>
            3
          </button>
          <button className="button operator" onClick={() => handleClick("+")}>
            +
          </button>
          <button className="button" onClick={() => handleClick("00")}>
            00
          </button>
          <button className="button" onClick={() => handleClick("0")}>
            0
          </button>
          <button className="button" onClick={() => handleClick(".")}>
            .
          </button>
          <button
            className="button operator equal"
            onClick={() => handleClick("=")}
          >
            =
          </button>
        </div>
      </div>
      <div className="logtable">
        {/* NewLogTable component to display and manage logs */}
        <NewLogTable
          refresh={refreshLogs}
          onDelete={() => setRefreshLogs((prev) => !prev)}
        />
      </div>
    </div>
  );
};

export default Calculator;
