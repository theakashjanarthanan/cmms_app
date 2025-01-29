// frontend\src\components\Register.jsx

import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";  
import API from "../api/api";  // API

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Guest",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate hook

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send registration request to backend

      await API.post("/auth/register", formData);
      setMessage("Registration Successful. Proceed with Login");

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate("/login"); // Redirect to login after 2 seconds
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data.message === "User already exists") {
        setMessage("User already exists. Please try with a different email.");
      } else {
        setMessage("Registration Failed");
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>

      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      {message && (
        <Typography
          color={message.includes("Successful") ? "success" : "error"}
        >
          {message}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit} width="300px">

            <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                margin="normal"
            />

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

            <TextField
                fullWidth
                select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                margin="normal"
                >
                {[
                    "Admin",
                    "Requestor",
                    "Technician",
                    "Guest",
                ].map((role) => (
                    <MenuItem key={role} value={role}>
                    {role}
                    </MenuItem>
                ))}
            </TextField>

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                Register
            </Button>
      </Box>

      <Link href="/login" underline="hover" mt={2}>
        Already have an account? Login
      </Link>

    </Box>
  );
};

export default Register;
