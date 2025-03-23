import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { api } from "../services/api";

function Todos({ todos, setTodos, refreshTodos }) {
  const [openNewTodo, setOpenNewTodo] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    priority: 1,
    complete: false,
  });

  const handleAddTodo = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.createTodo(token, newTodo);

      // Close the modal and reset the form
      setOpenNewTodo(false);
      setNewTodo({
        title: "",
        description: "",
        priority: 1,
        complete: false,
      });

      // Refresh the todos list
      await refreshTodos();
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const handleToggleComplete = async (todoId, isComplete) => {
    try {
      const token = localStorage.getItem("token");
      const todo = todos.find((t) => t.id === todoId);
      await api.updateTodo(token, todoId, { ...todo, complete: !isComplete });
      setTodos(
        todos.map((t) =>
          t.id === todoId ? { ...t, complete: !isComplete } : t
        )
      );
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const token = localStorage.getItem("token");
      await api.deleteTodo(token, todoId);
      setTodos(todos.filter((t) => t.id !== todoId));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your ToDos</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenNewTodo(true)}
        >
          Add New Todo
        </Button>
      </div>

      <Dialog open={openNewTodo} onClose={() => setOpenNewTodo(false)}>
        <DialogTitle>Add New Todo</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={newTodo.description}
            onChange={(e) =>
              setNewTodo({ ...newTodo, description: e.target.value })
            }
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="Priority (1-4)"
            type="number"
            value={newTodo.priority}
            onChange={(e) =>
              setNewTodo({ ...newTodo, priority: parseInt(e.target.value) })
            }
            margin="normal"
            inputProps={{ min: 1, max: 4 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewTodo(false)}>Cancel</Button>
          <Button onClick={handleAddTodo} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {todos && todos.length > 0 ? (
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{todo.title}</h3>
                <p className="text-gray-600">{todo.description}</p>
                <span className="text-sm text-gray-500">
                  Priority: {todo.priority}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outlined"
                  color={todo.complete ? "success" : "primary"}
                  onClick={() => handleToggleComplete(todo.id, todo.complete)}
                >
                  {todo.complete ? "Completed" : "Complete"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">No todos available.</p>
      )}
    </div>
  );
}

export default Todos;
