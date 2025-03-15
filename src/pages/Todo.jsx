import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  completeTask,
  removeTask,
  updateTask,
} from "../redux/features/counterSlice";

function Todo() {
  const [task, setTask] = useState("");
  const [editing, setEditing] = useState(null);
  const [newText, setNewText] = useState("");

  const dispatch = useDispatch();

  const todos = useSelector((state) => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return state.Counter.tasks.length ? state.Counter.tasks : storedTasks;
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (task.trim()) {
      dispatch(addTask(task));
      const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      storedTasks.push({ id: Date.now(), text: task, completed: false });
      localStorage.setItem("tasks", JSON.stringify(storedTasks));
      setTask("");
    }
  }

  function handleUpdate(id) {
    dispatch(updateTask({ id, newText }));
    const updatedTasks = todos.map((t) =>
      t.id === id ? { ...t, text: newText } : t
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setEditing(null);
    setNewText("");
  }

  function handleRemove(id) {
    dispatch(removeTask(id));
    const updatedTasks = todos.filter((t) => t.id !== id);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  function handleComplete(id) {
    dispatch(completeTask(id));
    const updatedTasks = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  return (
    <div>
      <h2>To-Do List</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={task}
          placeholder="Add task"
          onChange={(e) => setTask(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map((todo, index) => (
          <li key={index} style={{ color: todo.completed ? "green" : "red" }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleComplete(todo.id)}
            />
            {editing === todo.id ? (
              <>
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                />
                <button onClick={() => handleUpdate(todo.id)}>Submit</button>
              </>
            ) : (
              <>
                {todo.text}
                <button
                  onClick={() => {
                    setEditing(todo.id);
                    setNewText(todo.text);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleRemove(todo.id)}>Del</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
