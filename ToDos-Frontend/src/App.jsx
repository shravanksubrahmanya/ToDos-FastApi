import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Todos from "./components/Todos";
import Footer from "./components/Footer";
import { api } from "./services/api";
import { Button, Modal, Box, Typography } from "@mui/material";

function App() {
  const [todos, setTodos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [openUserInfo, setOpenUserInfo] = useState(false);

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

  const handleShowUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = await api.getUserInfo(token);
      setUserInfo(data);
      setOpenUserInfo(true);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      {isAuthenticated ? (
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="contained"
              color="info"
              onClick={handleShowUserInfo}
              className="mb-4"
            >
              Show User Info
            </Button>
            <Todos
              todos={todos}
              setTodos={setTodos}
              refreshTodos={fetchTodos}
            />
          </div>

          {/* User Info Modal */}
          <Modal open={openUserInfo} onClose={() => setOpenUserInfo(false)}>
            <Box sx={modalStyle}>
              <Typography variant="h6" component="h2" gutterBottom>
                User Information
              </Typography>
              {userInfo && (
                <div>
                  <Typography>
                    <strong>Username:</strong> {userInfo.username}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {userInfo.email}
                  </Typography>
                  <Typography>
                    <strong>First Name:</strong> {userInfo.first_name}
                  </Typography>
                  <Typography>
                    <strong>Last Name:</strong> {userInfo.last_name}
                  </Typography>
                  <Typography>
                    <strong>Role:</strong> {userInfo.role}
                  </Typography>
                </div>
              )}
            </Box>
          </Modal>
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
