import React, { useContext, useState } from "react";
import { AppBar, Toolbar, Button, Box, Alert, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../features/user/userSlice";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import { useCart } from "../CartContext";

export default function Navbar() {
  const { setIsLoggedIn } = useContext(AuthContext);
  const { cartCount, resetCartItems } = useCart();
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState("");
  const user = useSelector((state) => {
    return state?.user;
  });
  const dispatch = useDispatch();

  const handleLogout = () => {
    fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => {
        if (response.ok) {
          setIsLoggedIn(false);
          dispatch(setUser(undefined));
          resetCartItems();
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
            sx={{ flexGrow: 2.5, display: "flex", justifyContent: "flex-end" }}
          >
            <Alert severity="error" sx={{ mb: 1, mt: 1 }}>
              {logoutError}
            </Alert>
          </Box>
        )}
        <Typography component="h2">Train mART</Typography>
        <Box sx={{ flexGrow: 1 }} />
        {user !== undefined ? (
          <>
            <Button color="inherit" onClick={() => navigate("/select-art")}>
              Browse All Art
            </Button>
            {user.isArtist === true ? (
              <Button color="inherit" onClick={() => navigate("/your-art")}>
                Your Art
              </Button>
            ) : (
              <></>
            )}
            <Button color="inherit" onClick={() => navigate("/cart")}>
              <ShoppingCartIcon />
              <Badge badgeContent={cartCount} color="secondary">
                CART
              </Badge>
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
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
