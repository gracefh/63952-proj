import React, { useState, useEffect, useContext, useMemo } from "react";
import ArtListItem from "../components/art-list-item";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import {
  Typography,
  Button,
  List,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  Container,
  Paper,
  Pagination,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";

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
];

const itemsPerPage = 10;

export default function ArtistListViewPage({ artistName }) {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [page, setPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllLabel, setSelectAllLabel] = useState("Select All");
  const user = useSelector((state) => state.user);

  const pageCount = Math.ceil(images.length / itemsPerPage);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }
    axios.get(`/api/art?author=${user.email}`).then((value) => {
      setImages(value.data);
    });
  }, [user]);

  const handleSelectToggle = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      const allIds = currentItems.map((item) => item._id);
      setSelected(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleCheck = (id, isChecked) => {
    setSelected(
      isChecked ? [...selected, id] : selected.filter((item) => item !== id)
    );
  };

  const handleDelete = (id) => {
    axios.delete(`/api/art/${id}`);
    setImages(images.filter((item) => item._id !== id));
    setSelected(selected.filter((_id) => _id !== id));
  };

  const handleBulkDelete = () => {
    for (const item of selected) {
      axios.delete(`/api/art/${item}`);
    }
    setImages(images.filter((item) => !selected.includes(item._id)));
    setSelected([]);
  };

  const openEditDialog = (item) => {
    setEditItem(item);
  };

  const handleEdit = (id, newTitle, newPrice, newTags) => {
    console.log(id);
    console.log(images);
    setImages(
      images.map((item) =>
        item._id === id
          ? { ...item, title: newTitle, price: newPrice, tags: newTags }
          : item
      )
    );
    setEditItem(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([]); // Clear selection when changing pages
  };

  const currentItems = useMemo(
    () =>
      images !== undefined
        ? images.slice((page - 1) * itemsPerPage, page * itemsPerPage)
        : [],
    [images, page]
  );

  const memoizedSelected = useMemo(() => selected, [selected]);

  useEffect(() => {
    if (selected.length === currentItems.length) {
      setSelectAllLabel("Deselect All");
      setSelectAll(true);
    } else {
      setSelectAllLabel("Select All");
      setSelectAll(false);
    }
  }, [selected, currentItems]);

  return (
    <Box>
      <Navbar />
      <Container maxWidth="md">
        <Typography
          variant="h4"
          style={{ margin: "20px 0", textAlign: "center" }}
        >
          Hi, {user !== undefined ? user.firstName : artistName}
          {"   "}
          <TaskAltIcon fontSize="medium" htmlColor="green" />
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="20px"
        >
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSelectToggle}
              style={{ marginRight: "10px", width: "150px" }}
            >
              {selectAllLabel}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBulkDelete}
              disabled={selected.length === 0}
            >
              Delete Selected
            </Button>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/upload")}
          >
            Upload Artworks
          </Button>
        </Box>
        <Paper elevation={3} style={{ padding: "20px" }}>
          {images.length > 0 ? (
            <>
              <List>
                {currentItems.map((item) => (
                  <ArtListItem
                    key={item._id}
                    item={item}
                    isSelected={memoizedSelected.includes(item._id)}
                    onEdit={openEditDialog}
                    onDelete={() => handleDelete(item._id)}
                    onCheck={handleCheck}
                  />
                ))}
              </List>
              <Pagination
                count={pageCount}
                page={page}
                onChange={handleChangePage}
                style={{ marginTop: "20px" }}
              />
            </>
          ) : (
            <Typography style={{ textAlign: "center" }}>
              You have no artworks
            </Typography>
          )}
        </Paper>
        {editItem && (
          <Dialog open={Boolean(editItem)} onClose={() => setEditItem(null)}>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Image Name"
                type="text"
                fullWidth
                value={editItem.title}
                onChange={(e) =>
                  setEditItem({ ...editItem, title: e.target.value })
                }
              />

              <NumericFormat
                autoFocus
                margin="dense"
                label="Image Price (USD)"
                customInput={TextField}
                type="text"
                fullWidth
                defaultValue={editItem.price}
                thousandSeparator
                prefix="$"
                onValueChange={(values) => {
                  const { floatValue } = values;
                  setEditItem({ ...editItem, price: floatValue });
                }}
              />
              <Autocomplete
                multiple
                options={artisticStyles.map((option) => option)}
                defaultValue={editItem.tags}
                freeSolo
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
                    variant="standard"
                    label="Image Tags"
                  />
                )}
                onChange={(event, newValue) => {
                  setEditItem({ ...editItem, tags: newValue });
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditItem(null)} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() =>
                  handleEdit(
                    editItem._id,
                    editItem.title,
                    editItem.price,
                    editItem.tags
                  )
                }
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Container>
    </Box>
  );
}
