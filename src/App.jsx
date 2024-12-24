import { useEffect, useRef, useState } from "react";
import "./App.css";
import TaskList from "./components/TaskList";

function App() {
  const today = new Date().today;

  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [priority, setPriority] = useState("High");
  const [dueDate, setDueDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedPriority, setEditedPriority] = useState("High");
  const [editedDate, setEditedDate] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("task")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("task", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const newTask = task.trim();
    if (!newTask) return true;

    const newTaskObject = {
      id: Date.now(),
      text: newTask,
      isCompleted: false,
      priority,
      date: dueDate || "No deadline",
    };

    setTasks((prev) => [...prev, newTaskObject]);
    setTask("");
    setDueDate("");
    inputRef.current.focus();
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  // Chinh sua task
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditedText(task.text);
    setEditedPriority(task.priority);
    setEditedDate(task.date);
  };

  const saveEdit = (id) => {
    if (!editedText.trim()) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              text: editedText.trim(),
              priority: editedPriority,
              date: editedDate,
            }
          : task
      )
    );

    setEditingId(null);
    setEditedText("");
    setEditedPriority("High");
    setEditedDate("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditedText("");
    setEditedPriority("High");
    setEditedDate("");
  };

  const toggleCompleted = (id) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const sortTasks = (tasks) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return tasks.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  };

  // xac dinh deadline cua task
  const isNearDeadLine = (dueDate) => {
    if (dueDate === "No deadline") return false;
    const today = new Date();
    const deadline = new Date(dueDate);
    const difference = (deadline - today) / (1000 * 60 * 60 * 24);
    return difference <= 3;
  };

  // Loc task theo ky tu search, trang thai, hien thi tasks da duoc sort
  const filteredTasks = sortTasks([...tasks]).filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.isCompleted) ||
      (filter === "incompleted" && !task.isCompleted) ||
      (filter === "nearDeadline" && isNearDeadLine(task.date));

    const matchesSearch = task.text
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container">
      <h1 className="header">My Todolist</h1>

      {/* Thanh tim kiem */}
      <input
        type="text"
        className="search-input"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {/* Phan loai task theo trang thai */}
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
          className={`filter-button ${
            filter === "incompleted" ? "active" : ""
          }`}
          onClick={() => setFilter("incompleted")}
        >
          Incompleted
        </button>

        <button
          className={`filter-button ${
            filter === "nearDeadline" ? "active" : ""
          }`}
          onClick={() => setFilter("nearDeadline")}
        >
          Near Deadline
        </button>
      </div>

      {/* Them task */}
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

      {/* List task */}
      <ul className="task-list">
        {filteredTasks.map((task, index) => (
          <TaskList
            key={task.id}
            task={task}
            deleteTask={() => deleteTask(task.id)}
            toggleCompleted={() => toggleCompleted(task.id)}
            startEdit={startEdit}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            isEditing={editingId === task.id}
            editedText={editedText}
            setEditedText={setEditedText}
            editedPriority={editedPriority}
            setEditedPriority={setEditedPriority}
            editedDate={editedDate}
            setEditedDate={setEditedDate}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
