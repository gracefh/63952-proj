import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "../components/navbar";
import ArtCard from "../components/art-card";
import { useCart } from "../CartContext";
import { Paper } from "@mui/material";

const defaultTheme = createTheme();

export default function ShoppingCartPage() {
  const { cartItems, addToCart, removeFromCart } = useCart();

  const handleAddOrDelete = (item, inCart) => {
    if (!inCart) {
      addToCart(item);
    } else {
      removeFromCart(item._id);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Navbar />
      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Shopping Cart
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              You've added the works below to your cart!
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {cartItems.length > 0 ? (
              <Grid container spacing={4}>
                {cartItems.map((card) => (
                  <Grid item key={card._id} xs={12} sm={6} md={4}>
                    <ArtCard
                      card={card}
                      inCart={true}
                      handleAddOrDelete={() => handleAddOrDelete(card, true)}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper elevation={3} style={{ padding: "20px", width: "100%" }}>
                <Typography style={{ textAlign: "center" }}>
                  You have not added artworks to your cart
                </Typography>
              </Paper>
            )}
          </Box>
        </Container>
      </main>
    </ThemeProvider>
  );
}
