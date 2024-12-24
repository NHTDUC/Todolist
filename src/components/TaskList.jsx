const TaskList = ({
  task,
  deleteTask,
  toggleCompleted,
  startEdit,
  saveEdit,
  cancelEdit,
  isEditing,
  editedText,
  setEditedText,
  editedPriority,
  setEditedPriority,
  editedDate,
  setEditedDate,
}) => {
  return (
    <li className="task-item">
      {isEditing ? (
        <div className="edit-task-container">
          {/* Input chỉnh sửa văn bản */}
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="edit-input"
          />
          {/* Chỉnh sửa Priority */}
          <select
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value)}
            className="edit-priority"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          {/* Chỉnh sửa Due Date */}
          <input
            type="date"
            value={editedDate}
            onChange={(e) => setEditedDate(e.target.value)}
            className="edit-date"
          />
          {/* Nút Save và Cancel */}
          <button onClick={() => saveEdit(task.id)} className="save-button">
            Save
          </button>
          <button onClick={cancelEdit} className="cancel-button">
            Cancel
          </button>
        </div>
      ) : (
        <div className="task-container">
          <span
            onClick={toggleCompleted}
            className={`task-text ${task.isCompleted ? "completed" : ""}`}
          >
            {task.text} - <strong>{task.priority}</strong> -
            <strong> (Due: {task.date})</strong>
          </span>
          <button onClick={() => startEdit(task)} className="edit-button">
            Edit
          </button>
          <button onClick={deleteTask} className="delete-button">
            Delete
          </button>
        </div>
      )}
    </li>
  );
};

export default TaskList;
