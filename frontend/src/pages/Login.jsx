import React, { useState, useContext } from "react";
import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api/api"; // API
import AuthContext from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" }); // Separate error states for each field
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
      // Set specific error messages for each field
      if (err.response?.data?.message === "Invalid credentials") {
        setError({ email: "", password: "Invalid credentials. Please try again." }); // Show on password field
      } else if (err.response?.data?.message === "User does not exist") {
        setError({ email: "User does not exist, check your email.", password: "" });
        setTimeout(() => navigate("/register"), 3000); // Redirect after 3 seconds
      } else {
        setError({ email: "An error occurred. Please try again.", password: "" });
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"  // Light grey background for the entire page
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        width="400px"
        p={4}
        borderRadius={2}
        boxShadow={3}
        bgcolor="white"
      >
        {/* Logo & Title in the same row */}
        <Box display="flex" alignItems="center" width="100%" mb={2}>
          <img src="/images/settings.ico" alt="App Logo" width="40" style={{ marginRight: "10px" }} />

          {/* Log In Title */}
          <h2
            className="sc-dxgOiQ jbgQG"
            style={{
              fontSize: "25px",
              fontWeight: "600",
              lineHeight: "24px",
              color: "rgb(50, 50, 51)",
              whiteSpace: "nowrap",
              paddingBottom: "8px",
            }}
          >
            Log In
          </h2>
        </Box>

        <Typography variant="body2" color="textSecondary" mb={3}>
          Login to Explore
        </Typography>

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit} width="100%">
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            error={Boolean(error.email)} // Show error for email field only
            helperText={error.email} // Show specific error message for email
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
            error={Boolean(error.password)} // Show error for password field only
            helperText={error.password} // Show specific error message for password
          />

          <Box
            width="100%"
            sx={{
              cursor: !formData.email || !formData.password ? "not-allowed" : "pointer",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                pointerEvents: !formData.email || !formData.password ? "none" : "auto", // Prevent clicks when disabled
                "&:hover": {
                  backgroundColor: formData.email && formData.password ? "#00509E" : "#d1d1d1", // Dark blue hover effect
                },
              }}
              disabled={!formData.email || !formData.password}
            >
              Log in
            </Button>
          </Box>
        </Box>

        {/* Divider */}
        <Box width="100%" mt={3} mb={1}>
          <hr style={{ border: "none", height: "1px", backgroundColor: "#ddd" }} />
        </Box>

        {/* Signup Link */}
        <Typography variant="body2" color="textSecondary">
          New to Application? {" "}
          <Link href="/register" underline="hover">
            Sign up →
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
