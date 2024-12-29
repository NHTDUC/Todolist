import React from "react";
import "../styles/AddTask.css";

const AddTask = ({
  task,
  setTask,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  addTask,
  inputRef,
}) => {
  return (
    <div className="add-task-container">
      <input
        type="text"
        className="add-task-input"
        placeholder="Add task..."
        value={task}
        ref={inputRef}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
      />
      <select
        className="priority-dropdown"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <input
        type="date"
        className="due-date-input"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <button className="add-task-button" onClick={addTask}>
        Add
      </button>
    </div>
  );
};

export default AddTask;
