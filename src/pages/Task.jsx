import React, { useState, useEffect } from "react";
import axios from "axios";

const SERVER_API_URL =
  import.meta.env.VITE_SERVER_API_URL || "http://localhost:8000";

function Task() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(""); // Store input value

  // Fetch tasks from the server
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${SERVER_API_URL}/todos`);
      setTasks(response.data); // Assuming response.data is an array
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // Delete task and update UI
  const removeTask = async (id) => {
    try {
      await axios.delete(`${SERVER_API_URL}/delete/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!newTask.trim()) return; // Prevent empty tasks

    try {
      const response = await axios.post(`${SERVER_API_URL}/add`, {
        task: newTask,
      });

      // Check the correct response structure
      const newTaskData = response.data.todo; // Assuming `{ todo: { _id, task } }`

      console.log(newTaskData); // Debugging: Check what the API returns

      // Update state with the new task (including `_id`)
      setTasks((prevTasks) => [...prevTasks, newTaskData]);

      setNewTask(""); // Clear input field
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)} // Update state with input
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.task} {/* Assuming each task has a "task" field */}
            <button onClick={() => removeTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Task;
