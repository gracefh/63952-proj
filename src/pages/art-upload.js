import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Navbar from "../components/navbar";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";

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
export default function ArtUploadPage() {
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    if (event.target.files[0].size > 2097152) {
      setErrorMessage("File is too big!");
      return;
    }
    setSelectedFile(event.target.files[0]);
    event.target.value = "";
    setErrorMessage("");
  };

  const handleTextChange = (event) => {
    setTitle(event.target.value);
  };

  const handleRemoveFile = (index) => {
    setSelectedFile(undefined);
    document.getElementById("file-input").value = "";
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFile === undefined) {
      setErrorMessage("Can't upload without file");
      return;
    }
    try {
      const response = await axios.get(
        `/api/presignedUrl?fileType=${encodeURIComponent(
          selectedFile.type.split("/")[1]
        )}`
      );
      const { key, uploadUrl } = response.data;
      await axios.put(uploadUrl, selectedFile, {
        headers: { "Content-Type": selectedFile.type },
      });
      await axios.post(`/api/art`, {
        title: title,
        link: `https://s3.us-east-2.amazonaws.com/6.3952-final-proj/${key}`,
        price: price.substring(1),
        tags: tags,
      });
      navigate("/your-art");
    } catch (error) {
      setErrorMessage("Upload failed");
    }
  };

  return (
    <Box>
      <Navbar />
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Upload Your Art Here!
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {/* Error Message */}
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            {/* File Input and List */}
            <Paper
              variant="outlined"
              sx={{
                padding: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 2,
                cursor: "pointer",
                minHeight: 200,
                width: 500,
                border: "2px dashed #666",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Input
                type="file"
                inputProps={{ multiple: false }}
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="file-input"
              />
              <label htmlFor="file-input">
                <Button
                  variant="contained"
                  component="span"
                  sx={{ mt: 2, width: 500 }}
                >
                  {selectedFile !== undefined ? `Change File` : "Choose Files"}
                </Button>
              </label>

              {selectedFile !== undefined ? (
                <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                  {[selectedFile].map((file, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={file.name} />
                    </ListItem>
                  ))}
                </List>
              ) : null}
            </Paper>

            {/* Title Input */}
            <TextField
              label="Title of Artwork"
              value={title}
              onChange={handleTextChange}
              fullWidth
              sx={{ mb: 1 }}
              variant="outlined"
            />

            {/* Price Input */}
            <NumericFormat
              sx={{ mb: 1 }}
              label="Art Price (USD)"
              customInput={TextField}
              type="text"
              fullWidth
              thousandSeparator
              prefix="$"
              onChange={handlePriceChange}
              value={price}
            />

            {/* Tags Input */}
            <Autocomplete
              multiple
              id="tags"
              options={artisticStyles}
              freeSolo
              value={tags}
              onChange={(event, newValue) => {
                setTags(newValue);
              }}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Tags"
                  placeholder="Add Tags"
                />
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Upload
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
