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
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate hook

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send registration request to backend
      await API.post("/auth/register", formData);
      setError("Registration Successful. Proceed with Login");

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate("/login"); // Redirect to login after 2 seconds
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data.message === "User already exists") {
        setError("User already exists.");
      } else {
        setError("Registration Failed");
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Box display="flex" flexDirection="column" alignItems="flex-start" width="400px" p={4} borderRadius={2} boxShadow={3} bgcolor="white">
        {/* Logo & Title in the same row */}
        <Box display="flex" alignItems="center" width="100%" mb={2}>
          <img src="/Images/settings.ico" alt="App Logo" width="40" style={{ marginRight: "10px" }} />

          {/* Register Title */}
          <h2
            style={{
              fontSize: "25px",
              fontWeight: "600",
              lineHeight: "24px",
              color: "rgb(50, 50, 51)",
              whiteSpace: "nowrap",
              paddingBottom: "8px",
            }}
          >
            Register Here
          </h2>
        </Box>

        {/* Display success or error message */}
        {error && (
          <Typography color={error.includes("Successful") ? "success" : "error"} textAlign="center" mb={2}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} width="100%">
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            margin="normal"
            required
          >
            {["Admin", "Requestor", "Technician", "Guest"].map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>

          <Box width="100%" sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                pointerEvents: !formData.fullName || !formData.email || !formData.password ? "none" : "auto", // Disable when any field is empty
                "&:hover": {
                  backgroundColor: formData.fullName && formData.email && formData.password ? "#00509E" : "#d1d1d1", // Dark blue hover effect
                },
              }}
              disabled={!formData.fullName || !formData.email || !formData.password}
            >
              Register
            </Button>
          </Box>
        </Box>

        <Box width="100%" mt={3} mb={1}>
          <hr style={{ border: "none", height: "1px", backgroundColor: "#ddd" }} />
        </Box>

        <Typography variant="body2" color="textSecondary" textAlign="center">
          Already have an account?{" "}
          <Link href="/login" underline="hover">
            Login →
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
