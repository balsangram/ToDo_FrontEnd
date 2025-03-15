import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Load server URL from environment
const SERVER_API_URL = import.meta.env.VITE_SERVER_API_URL || "http://localhost:8000";

// Fetch all tasks from the server
export const fetchTasks = createAsyncThunk("todo/fetchTasks", async () => {
  const response = await fetch(`${SERVER_API_URL}/todos`);
  return response.json();
});

// Add task to the server
export const addTask = createAsyncThunk("todo/addTask", async (taskText) => {
  const response = await fetch(`${SERVER_API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task: taskText }),
  });
  return response.json();
});

// Update task on the server
export const updateTask = createAsyncThunk("todo/updateTask", async ({ id, newText }) => {
  const response = await fetch(`${SERVER_API_URL}/update/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task: newText }),
  });
  return response.json();
});

// Delete task from the server
export const removeTask = createAsyncThunk("todo/removeTask", async (id) => {
  await fetch(`${SERVER_API_URL}/delete/${id}`, { method: "DELETE" });
  return id; // Return deleted task ID
});

// Toggle task completion on the server
export const completeTask = createAsyncThunk("todo/completeTask", async (id) => {
  const response = await fetch(`${SERVER_API_URL}/update/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: true }),
  });
  return response.json();
});

// Redux slice
export const todoSlice = createSlice({
  name: "todo",
  initialState: {
    tasks: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload.todo);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.todo.id);
        if (index !== -1) {
          state.tasks[index] = action.payload.todo;
        }
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        const task = state.tasks.find((task) => task.id === action.payload.todo.id);
        if (task) {
          task.completed = action.payload.todo.completed;
        }
      });
  },
});

export default todoSlice.reducer;
