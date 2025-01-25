// frontend\src\components\Login.jsx

import React, { useState, useContext } from "react";
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api/api";                  // API
import AuthContext from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { setAuthUser } = useContext(AuthContext); // Use setAuthUser to set user
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", formData);
      localStorage.setItem("token", data.token);

      // Decode the JWT token to get the user info
      const decodedUser = jwtDecode(data.token).user;

      // Update the Auth context with the user info
      setAuthUser(decodedUser);

      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.message === "Invalid credentials") {
        setError("Invalid credentials. Please try again.");
      } else if (err.response?.data?.message === "User does not exist") {
        setError("User does not exist. Please check your email or register.");
        // Redirect to the login page after displaying the message
        setTimeout(() => navigate("/register"), 3000); // Redirect after 3 seconds
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Box component="form" onSubmit={handleSubmit} width="300px">

            <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
            />
            <TextField
                fullWidth
                type="password"
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
            />
        
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>

      <Link href="/register" underline="hover" mt={2}>
        New User? Create an Account
      </Link>

    </Box>
  );
};

export default Login;