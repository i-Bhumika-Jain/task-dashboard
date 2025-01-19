import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";
import TaskTable from "./Components/TaskTable";
import AddTaskModal from "./Components/AddTaskModal";

const socket = io("http://localhost:5000"); // Replace with backend URL

function Component() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch tasks on load
    axios.get("http://localhost:5000/tasks").then((response) => {
      setTasks(response.data);
    });

    // Real-time updates
    socket.on("taskAdded", (newTask) => {
      toast.success("Task added!");
      setTasks((prev) => [...prev, newTask]);
    });

    socket.on("taskUpdated", (updatedTask) => {
      toast.info("Task updated!");
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
    });

    socket.on("taskDeleted", (deletedId) => {
      toast.error("Task deleted!");
      setTasks((prev) => prev.filter((task) => task.id !== deletedId));
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="container mt-4">
      <h1>Task Management Dashboard</h1>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowModal(true)}
      >
        Add Task
      </button>
      <TaskTable tasks={tasks} />
      <AddTaskModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onTaskAdded={(newTask) => socket.emit("taskAdded", newTask)}
      />
      <ToastContainer />
    </div>
  );
}

export default Component;
