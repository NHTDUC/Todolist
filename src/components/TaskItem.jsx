import React from "react";
import "../styles/TaskItem.css";

const TaskItem = ({
  task,
  toggleCompleted,
  startEdit,
  deleteTask,
  isEditing,
  editedText,
  setEditedText,
  editedPriority,
  setEditedPriority,
  editedDate,
  setEditedDate,
  saveEdit,
  cancelEdit,
}) => {
  return (
    <div className="task-item">
      {isEditing ? (
        <div className="edit-task-container">
          <input
            className="edit-input"
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          <select
            value={editedPriority}
            className="priority-dropdown"
            onChange={(e) => setEditedPriority(e.target.value)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <input
            type="date"
            value={editedDate}
            className="due-date-input"
            onChange={(e) => setEditedDate(e.target.value)}
          />
          <button className="save-button" onClick={() => saveEdit(task.id)}>
            Save
          </button>
          <button className="cancel-button" onClick={cancelEdit}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          <span
            onClick={() => toggleCompleted(task.id)}
            className={`task-text ${task.isCompleted ? "completed" : ""}`}
          >
            {task.text} - {task.priority} - (Due: {task.date})
          </span>
          <button className="edit-button" onClick={() => startEdit(task)}>
            Edit
          </button>
          <button className="delete-button" onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default TaskItem;
