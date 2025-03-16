import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input, List, ListItem, ListItemText, Box } from "@mui/material";
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const SERVER_API_URL = import.meta.env.VITE_SERVER_API_URL || "http://localhost:8000";

function Task() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

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
      const response = await axios.post(`${SERVER_API_URL}/add`, { task: newTask });

      const newTaskData = response.data.todo; // Assuming `{ todo: { _id, task } }`
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
    <Box sx={{ margin: "auto", mt: 4, textAlign: "center" }}>
      <Input
        placeholder="Enter task"
        value={newTask}
        size="md"
        sx={{ width: "70%", marginRight: "8px" }}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={addTask}>
      <IoMdAdd />
      </Button>

      <List sx={{ mt: 2 }}>
        {tasks.map((task , index) => (
          <ListItem key={task._id} sx={{ display: "flex", justifyContent: "space-between" }}>
            <ListItemText primary= {`${index+1}  ${task.task}`} />
            <Button variant="contained" color="error" onClick={() => removeTask(task._id)}>
            <MdDelete />
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default Task;
