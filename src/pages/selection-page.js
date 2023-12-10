import React, { useState, useMemo, useEffect } from "react";
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
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import axios from "axios";
import FloatingCartIcon from "../components/floating-cart-count";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Collapse,
} from "@mui/material";

const defaultTheme = createTheme();

const artisticStyles = [
  "Abstract",
  "Baroque",
  "Surrealism",
  "Impressionism",
  "Cubism",
  "Rococo",
  "Realism",
  "Expressionism",
  "Minimalism",
  "Renaissance",
  "Pop Art",
  "Futurism",
  "Art Nouveau",
  "Gothic",
  "Neo-Classicism",
  "Romanticism",
  "Graffiti",
  "Digital",
  "Photorealism",
  "Conceptual",
  "Modernism",
  "Other",
];

const dummyData = [
  {
    id: 1,
    name: "Image1.jpg",
    price: 1,
    tags: ["Expressionism"],
    artist: "Catherine",
  },
  {
    id: 2,
    name: "Image2.jpg",
    price: 12,
    tags: ["Rococo"],
    artist: "Grace",
  },
  {
    id: 3,
    name: "Image3.jpg",
    price: 0.85,
    tags: ["Baroque", "Abstract"],
    artist: "Avery",
  },
  {
    id: 4,
    name: "Image4.jpg",
    price: 0,
    tags: ["Pop Art", "Expressionism", "Rococo"],
    artist: "Taylor",
  },
  {
    id: 5,
    name: "Image5.jpg",
    price: 0,
    tags: ["Impressionism"],
    artist: "Charlie",
  },
  {
    id: 6,
    name: "Image6.jpg",
    price: 0,
    tags: ["Abstract", "Impressionism"],
    artist: "Sam",
  },
  {
    id: 7,
    name: "Image7.jpg",
    price: 10,
    tags: ["Rococo", "Abstract"],
    artist: "Grace",
  },
  {
    id: 8,
    name: "Image8.jpg",
    price: 0,
    tags: ["Surrealism", "My Label"],
    artist: "Ivy",
  },
  {
    id: 9,
    name: "Image9.jpg",
    price: 0,
    tags: ["Minimalism", "Expressionism"],
    artist: "Catherine",
  },
];

const maxPrice = 100;

const filterOptions = createFilterOptions({
  matchFrom: "start",
  stringify: (option) => option,
});

export default function SelectionPage() {
  const [images, setImages] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [sortOrder, setSortOrder] = useState("");
  const [showStyleFilter, setShowStyleFilter] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/art");
        setImages(response.data);
      } catch (error) {
        setError("Failed to load art pieces. Please try again later.");
        console.error("Error fetching art data:", error);
      }
    };

    fetchData();
  }, []);

  const handleStyleChange = (event, value) => {
    setSelectedStyles(value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const clearAllFilters = () => {
    setSelectedStyles([]);
    setPriceRange([0, maxPrice]);
    setSortOrder("");
  };

  const filteredImages = useMemo(() => {
    return images
      .filter((image) => {
        if (selectedStyles.includes("Other")) {
          return image.tags.some(
            (tag) =>
              !artisticStyles.includes(tag) || selectedStyles.includes(tag)
          );
        }
        return (
          selectedStyles.length === 0 ||
          image.tags.some((tag) => selectedStyles.includes(tag))
        );
      })
      .filter(
        (image) => image.price >= priceRange[0] && image.price <= priceRange[1]
      )
      .sort((a, b) => {
        if (sortOrder === "low-high") {
          return a.price - b.price;
        } else if (sortOrder === "high-low") {
          return b.price - a.price;
        }
        return 0;
      });
  }, [images, selectedStyles, priceRange, sortOrder]);

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
            <Box>
              <Button onClick={() => setShowStyleFilter(!showStyleFilter)}>
                Art Style Filter
              </Button>
              <Collapse
                in={showStyleFilter}
                sx={{ position: "absolute", zIndex: 1, minWidth: 150, mt: 1 }}
              >
                <Autocomplete
                  multiple
                  options={artisticStyles}
                  value={selectedStyles}
                  onChange={handleStyleChange}
                  filterOptions={filterOptions}
                  freeSolo
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option}
                        size="small"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Art Styles"
                      placeholder="Select or type"
                    />
                  )}
                />
              </Collapse>
            </Box>
            {/* Spacer box */}
            <Box flexGap={4} />
            <Box>
              <Button onClick={() => setShowPriceFilter(!showPriceFilter)}>
                Price Filter
              </Button>
              <Collapse
                in={showPriceFilter}
                sx={{ position: "absolute", zIndex: 1, width: 300, mt: 1 }}
              >
                <Box>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="$"
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([
                          Math.max(0, Number(e.target.value)),
                          priceRange[1],
                        ])
                      }
                      inputProps={{ min: 0, max: priceRange[1] }}
                      sx={{ width: "85px" }}
                    />
                    <TextField
                      label="$$$"
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          Math.min(Number(e.target.value), maxPrice),
                        ])
                      }
                      inputProps={{ min: priceRange[0], max: maxPrice }}
                      sx={{ width: "85px" }}
                    />
                  </Stack>
                </Box>
              </Collapse>
            </Box>
            {/* Spacer box */}
            <Box flexGap={16} />
            <Button
              onClick={clearAllFilters}
              variant="outlined"
              sx={{
                alignSelf: "center",
              }}
            >
              Clear All Filters
            </Button>

            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortOrder}
                label="Sort By"
                onChange={handleSortChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="low-high">Price: Low to High</MenuItem>
                <MenuItem value="high-low">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ marginTop: 5 }}>
            {/* Error message display */}
            {error && (
              <Container sx={{ mb: 3 }}>
                <Alert severity="error">{error}</Alert>
              </Container>
            )}
            <Grid container spacing={4}>
              {filteredImages.map((card) => (
                <Grid item key={card.id} xs={12} sm={6} md={4}>
                  <ArtCard card={card} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </main>
      <FloatingCartIcon />
    </ThemeProvider>
  );
}
