import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";
import { auth, db } from "./firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import Auth from "./components/Auth";
import AddTask from "./components/AddTask";
import Filter from "./components/Filter";
import ModeSwitch from "./components/ModeSwitch";
import TaskList from "./components/TaskList";

function App() {
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
  const [isDragMode, setIsDragMode] = useState(true); // Kéo thả hay sắp xếp tự động
  const [currentUser, setCurrentUser] = useState(null);

  const inputRef = useRef(null);

  // useEffect(() => {
  //   const savedTasks = JSON.parse(localStorage.getItem("task")) || [];
  //   setTasks(savedTasks);
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("task", JSON.stringify(tasks));
  // }, [tasks]);

  // const loadTasksFromFirestore = async (userId) => {
  //   try {
  //     const tasksRef = collection(db, "tasks");
  //     const q = query(tasksRef, where("userId", "==", userId));
  //     const querySnapshot = await getDocs(q);

  //     const userTasks = querySnapshot.docs.map((doc) => doc.data());
  //     setTasks(userTasks[0]?.tasks || []);
  //   } catch (error) {
  //     console.error("Error loading tasks:", error);
  //   }
  // };

  // Save tasks to Firestore

  const saveTasksToFirestore = async (userId, tasks) => {
    try {
      const tasksRef = doc(db, "tasks", userId);
      await setDoc(tasksRef, { userId, tasks });
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  // Load tasks in real-time
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      return;
    }

    const tasksRef = doc(db, "tasks", currentUser.uid);
    const unsubscribe = onSnapshot(tasksRef, (doc) => {
      if (doc.exists()) {
        setTasks(doc.data()?.tasks || []);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Save tasks with debounce
  useEffect(() => {
    if (!currentUser) return;

    const timeout = setTimeout(() => {
      saveTasksToFirestore(currentUser.uid, tasks);
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeout);
  }, [tasks, currentUser]);

  const addTask = () => {
    const newTask = task.trim();
    if (!newTask) return;

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
      prev.map((task) =>
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

  const isNearDeadline = (dueDate) => {
    if (dueDate === "No deadline") return false;
    const today = new Date();
    const deadline = new Date(dueDate);
    const difference = (deadline - today) / (1000 * 60 * 60 * 24);
    return difference <= 3;
  };

  const filteredTasks = (isDragMode ? tasks : sortTasks([...tasks])).filter(
    (task) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && task.isCompleted) ||
        (filter === "incompleted" && !task.isCompleted) ||
        (filter === "nearDeadline" && isNearDeadline(task.date));

      const matchesSearch = task.text
        .toLowerCase()
        .includes(searchText.toLowerCase());

      return matchesSearch && matchesFilter;
    }
  );

  const handleDragEnd = (result) => {
    if (!isDragMode) return; // Không xử lý nếu không ở chế độ kéo thả
    const { source, destination } = result;

    if (!destination) return;
    if (source.index === destination.index) return;

    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, movedTask);

    setTasks(reorderedTasks);
  };

  if (!currentUser) {
    return <Auth onLogin={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="container">
      <h1>My Todo List</h1>
      <ModeSwitch isDragMode={isDragMode} setIsDragMode={setIsDragMode} />
      <input
        type="text"
        placeholder="Search..."
        className="search-input"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Filter filter={filter} setFilter={setFilter} />
      <AddTask
        task={task}
        setTask={setTask}
        priority={priority}
        setPriority={setPriority}
        dueDate={dueDate}
        setDueDate={setDueDate}
        addTask={addTask}
        inputRef={inputRef}
      />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <TaskList
                tasks={filteredTasks}
                toggleCompleted={toggleCompleted}
                startEdit={startEdit}
                deleteTask={deleteTask}
                isEditing={editingId}
                editedText={editedText}
                setEditedText={setEditedText}
                editedPriority={editedPriority}
                setEditedPriority={setEditedPriority}
                editedDate={editedDate}
                setEditedDate={setEditedDate}
                saveEdit={saveEdit}
                cancelEdit={cancelEdit}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
