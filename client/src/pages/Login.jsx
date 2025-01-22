//import React from 'react'
import { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Alert,
} from "@mui/material";

import { Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  //media query
  const isNotMobile = useMediaQuery("(min-width:1000px)");
  //states
 
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  //register ctrl
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    
    if (password.length < 6) {
      setError("Password length should be at least 6 characters long");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password
      });
      
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token.accessToken);
        toast.success("Login successful!");
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error?.message ||
                          "Invalid credentials";
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Add function to clear error when user starts typing
  const handleInputChange = (setter) => (e) => {
    setError(""); // Clear error when user types
    setter(e.target.value);
  };

  return (
    <Box
      width={isNotMobile ? "40%" : "80%"}
      p={"2rem"}
      m={"2rem auto"}
      borderRadius={5}
      sx={{ boxShadow: 5 }}
      bgcolor={theme.palette.background.alt}
    >
      {error && (
        <Alert 
          severity="error" 
          sx={{
            mb: 2,
            width: '100%',
            '& .MuiAlert-message': {
              width: '100%',
              fontWeight: 'medium'
            }
          }}
        >
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Typography variant="h3">Sign In</Typography>

      

        <TextField
          label="email"
          type="email"
          required
          margin="normal"
          fullWidth
          value={email}
          onChange={handleInputChange(setEmail)}
        />
        <TextField
          label="password"
          type="password"
          required
          margin="normal"
          fullWidth
          value={password}
          onChange={handleInputChange(setPassword)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ color: "white", mt: 2 }}
        >
          Sign In
        </Button>
        <Typography mt={2}> Dont have an account ? <Link to="/Register">Please Register</Link></Typography>
      </form>
    </Box>
  );
}

export default Login