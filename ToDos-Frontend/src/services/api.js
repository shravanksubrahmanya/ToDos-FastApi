const BASE_URL = "http://localhost:8000";

export const api = {
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${BASE_URL}/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  getTodos: async (token) => {
    const response = await fetch(`${BASE_URL}/todos/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized access");
      }
      throw new Error("Failed to fetch todos");
    }

    return response.json();
  },

  createTodo: async (token, todoData) => {
    const response = await fetch(`${BASE_URL}/todos/todo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      throw new Error("Failed to create todo");
    }

    return response.json();
  },

  updateTodo: async (token, todoId, todoData) => {
    const response = await fetch(`${BASE_URL}/todos/todo/${todoId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoData),
    });

    if (!response.ok) {
      throw new Error("Failed to update todo");
    }

    return response.status === 204;
  },

  deleteTodo: async (token, todoId) => {
    const response = await fetch(`${BASE_URL}/todos/todo/${todoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.status === 204;
  },

  getUserInfo: async (token) => {
    const response = await fetch(`${BASE_URL}/users/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    return response.json();
  },

  changePassword: async (token, passwordData) => {
    const response = await fetch(`${BASE_URL}/users/change-password/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      throw new Error("Failed to change password");
    }

    return response.status === 204;
  },
};
