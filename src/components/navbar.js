import React, { useContext, useState } from "react";
import { AppBar, Toolbar, Button, Box, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = () => {
    fetch("http://localhost:5000/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(false);
          navigate("/");
        } else {
          setLogoutError("Something went wrong. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        setLogoutError("Something went wrong. Please try again.");
      });
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {logoutError && (
          <Box
            sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
          >
            <Alert severity="error" sx={{ mb: 1, mt: 1 }}>
              {logoutError}
            </Alert>
          </Box>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {isLoggedIn ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate("/sign-in")}>
              Sign In
            </Button>
            <Button color="inherit" onClick={() => navigate("/sign-up")}>
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
