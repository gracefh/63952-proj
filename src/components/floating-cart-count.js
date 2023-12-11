import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import { useCart } from "../CartContext";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const FloatingCartIcon = () => {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10%",
        right: "5%",
        zIndex: 1000,
      }}
    >
      <IconButton
        color="primary"
        style={{ fontSize: "3rem" }}
        onClick={() => navigate("/cart")}
      >
        <Badge badgeContent={cartCount} color="secondary">
          <ShoppingCartIcon style={{ fontSize: "3rem" }} />
        </Badge>
      </IconButton>
    </div>
  );
};

export default FloatingCartIcon;
