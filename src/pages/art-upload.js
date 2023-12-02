import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Navbar from "../components/navbar";

export default function ArtUploadPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
    event.target.value = "";
  };

  const handleRemoveFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    document.getElementById("file-input").value = "";
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(selectedFiles);
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
                inputProps={{ multiple: true }}
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
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} file${
                        selectedFiles.length > 1 ? "s" : ""
                      } selected`
                    : "Choose Files"}
                </Button>
              </label>

              <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                {selectedFiles.map((file, index) => (
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
            </Paper>
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
