import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Todos from "./components/Todos";
import Footer from "./components/Footer";
import { api } from "./services/api";

function App() {
  const [todos, setTodos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchTodos();
    }
  }, [isAuthenticated]); // This ensures the effect runs when auth state changes

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await api.getTodos(token);
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      if (error.status === 401) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      {isAuthenticated ? (
        <main className="flex-grow">
          <Todos
            todos={todos}
            setTodos={setTodos}
            refreshTodos={fetchTodos} // Pass the refresh function
          />
        </main>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-600">
            Please login to view your todos
          </p>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;
