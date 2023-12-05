import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "../components/navbar";
import ArtCard from "../components/art-card";

const defaultTheme = createTheme();
const dummyData = [
  { id: 1, name: "Image1.jpg", price: 0, tags: "modern, test" },
  { id: 2, name: "Image2.jpg", price: 0, tags: "" },
  { id: 3, name: "Image3.jpg", price: 0, tags: "" },
  { id: 4, name: "Image4.jpg", price: 0, tags: "" },
  { id: 5, name: "Image5.jpg", price: 0, tags: "" },
  { id: 6, name: "Image6.jpg", price: 0, tags: "" },
  { id: 7, name: "Image7.jpg", price: 0, tags: "" },
  { id: 8, name: "Image8.jpg", price: 0, tags: "" },
  { id: 9, name: "Image9.jpg", price: 0, tags: "" },
];

export default function SelectionPage() {
  const [images, setImages] = useState(dummyData);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Navbar />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
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
              Select Artworks
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              Select art pieces to use in training data to add to your cart.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained">Checkout</Button>
              <Button variant="outlined">Clear cart</Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* Grid for Art Cards */}
          <Grid container spacing={4}>
            {images.map((card) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <ArtCard card={card} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}
