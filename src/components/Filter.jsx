import React from "react";
import "../styles/Filter.css";

const Filter = ({ filter, setFilter }) => {
  return (
    <div className="filter-container">
      <button
        className={`filter-button ${filter === "all" ? "active" : ""}`}
        onClick={() => setFilter("all")}
      >
        All
      </button>
      <button
        className={`filter-button ${filter === "completed" ? "active" : ""}`}
        onClick={() => setFilter("completed")}
      >
        Completed
      </button>
      <button
        className={`filter-button ${filter === "incompleted" ? "active" : ""}`}
        onClick={() => setFilter("incompleted")}
      >
        Incompleted
      </button>
      <button
        className={`filter-button ${filter === "nearDeadline" ? "active" : ""}`}
        onClick={() => setFilter("nearDeadline")}
      >
        Near Deadline
      </button>
    </div>
  );
};

export default Filter;
