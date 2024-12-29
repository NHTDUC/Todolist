import React from "react";
import TaskItem from "./TaskItem";
import "../styles/TaskList.css";

const TaskList = ({
  tasks,
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
    <>
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          toggleCompleted={toggleCompleted}
          startEdit={startEdit}
          deleteTask={deleteTask}
          isEditing={isEditing === task.id}
          editedText={editedText}
          setEditedText={setEditedText}
          editedPriority={editedPriority}
          setEditedPriority={setEditedPriority}
          editedDate={editedDate}
          setEditedDate={setEditedDate}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
        />
      ))}
    </>
  );
};

export default TaskList;
