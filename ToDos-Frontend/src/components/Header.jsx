import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  Alert,
  IconButton,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { api } from "../services/api";

function Header({ isAuthenticated, setIsAuthenticated, onShowUserInfo }) {
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "user",
  });

  const modalBoxStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.login(loginData.username, loginData.password);
      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
        setIsAuthenticated(true);
        setOpenSignIn(false);
      } else {
        setError("Login failed");
      }
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.register(registerData);
      setOpenSignUp(false);
      setOpenSignIn(true);
    } catch (err) {
      setError("Registration failed: " + err.message);
    }
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      {/* Login Modal */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <Box sx={modalBoxStyle}>
          <Typography variant="h6" component="h2" mb={2}>
            Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleLoginSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={loginData.username}
              onChange={(e) =>
                setLoginData({ ...loginData, username: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Modal>

      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">ToDos</h1>
        <nav>
          <ul className="flex space-x-6 items-center">
            {isAuthenticated ? (
              <>
                <li>
                  <IconButton
                    color="inherit"
                    onClick={onShowUserInfo}
                    className="hover:text-gray-300"
                  >
                    <AccountCircleIcon />
                  </IconButton>
                </li>
                <li>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenSignIn(true)}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => setOpenSignUp(true)}
                  sx={{ ml: 2 }}
                >
                  SignUp
                </Button>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
