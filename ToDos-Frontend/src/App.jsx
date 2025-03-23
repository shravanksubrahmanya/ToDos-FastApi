import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Todos from "./components/Todos";
import Footer from "./components/Footer";
import { api } from "./services/api";
import { Button, Modal, Box, Typography, Avatar, Divider } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import WorkIcon from "@mui/icons-material/Work";

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
        onShowUserInfo={handleShowUserInfo}
      />
      {isAuthenticated ? (
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-4">
            <Todos
              todos={todos}
              setTodos={setTodos}
              refreshTodos={fetchTodos}
            />
          </div>

          {/* User Info Modal */}
          <Modal open={openUserInfo} onClose={() => setOpenUserInfo(false)}>
            <Box sx={modalStyle}>
              <div className="flex flex-col items-center mb-6">
                <Avatar
                  sx={{ width: 80, height: 80, bgcolor: "primary.main", mb: 2 }}
                >
                  {userInfo?.first_name?.[0]}
                  {userInfo?.last_name?.[0]}
                </Avatar>
                <Typography variant="h5" component="h2" gutterBottom>
                  {userInfo?.first_name} {userInfo?.last_name}
                </Typography>
              </div>

              <Divider sx={{ my: 2 }} />

              {userInfo && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <PersonIcon color="primary" />
                    <Typography>
                      <strong>Username:</strong> {userInfo.username}
                    </Typography>
                  </div>

                  <div className="flex items-center space-x-3">
                    <EmailIcon color="primary" />
                    <Typography>
                      <strong>Email:</strong> {userInfo.email}
                    </Typography>
                  </div>

                  <div className="flex items-center space-x-3">
                    <BadgeIcon color="primary" />
                    <Typography>
                      <strong>Full Name:</strong> {userInfo.first_name}{" "}
                      {userInfo.last_name}
                    </Typography>
                  </div>

                  <div className="flex items-center space-x-3">
                    <WorkIcon color="primary" />
                    <Typography>
                      <strong>Role:</strong> {userInfo.role}
                    </Typography>
                  </div>
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
