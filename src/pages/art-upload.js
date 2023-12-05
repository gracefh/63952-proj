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
import axios from "axios";

export default function ArtUploadPage() {
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [title, setTitle] = useState("");

  const handleFileChange = (event) => {
    if (event.target.files[0].size > 2097152) {
      alert("File is too big!");
      return;
    }
    setSelectedFile(event.target.files[0]);
    event.target.value = "";
  };

  const handleTextChange = (event) => {
    setTitle(event.target.value);
  };

  const handleRemoveFile = (index) => {
    setSelectedFile(undefined);
    document.getElementById("file-input").value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFile === undefined) {
      alert("Can't upload without file");
    }
    const response = await axios.get(
      `/api/presignedUrl?fileType=${encodeURIComponent(
        selectedFile.type.split("/")[1]
      )}`
    );
    const { key, uploadUrl } = response.data;
    await axios.put(uploadUrl, selectedFile, 
      {
        headers: { "Content-Type": selectedFile.type },
      });
    await axios.post(
      `/api/art`,
      {
        title: title,
        link: `https://s3.us-east-2.amazonaws.com/6.3952-final-proj/${key}`,
      }
    );
    alert("Successfully uploaded");
    return key;
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
              ) : (
                <></>
              )}
            </Paper>
            <label htmlFor="title">
              <Typography>Title of artwork</Typography>
            </label>
            <Input type="text" onChange={handleTextChange} id="title" />
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
