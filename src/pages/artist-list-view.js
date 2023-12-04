import React, { useState, useEffect } from "react";
import ArtListItem from "../components/art-list-item";
import Navbar from "../components/navbar";
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

const itemsPerPage = 10;

export default function ArtistListViewPage({ artistName }) {
  const [images, setImages] = useState(dummyData);
  const [selected, setSelected] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [page, setPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllLabel, setSelectAllLabel] = useState("Select All");

  const pageCount = Math.ceil(images.length / itemsPerPage);

  const handleSelectToggle = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      const allIds = currentItems.map((item) => item.id);
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
    setImages(images.filter((item) => item.id !== id));
    setSelected(selected.filter((item) => item !== id));
  };

  const handleBulkDelete = () => {
    setImages(images.filter((item) => !selected.includes(item.id)));
    setSelected([]);
  };

  const handleSelectAll = () => {
    const currentPageItems = images.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
    const allIds = currentPageItems.map((item) => item.id);
    setSelected(allIds);
  };

  const openEditDialog = (item) => {
    setEditItem(item);
  };

  const handleEdit = (newName) => {
    setImages(
      images.map((item) =>
        item.id === editItem.id ? { ...item, name: newName } : item
      )
    );
    setEditItem(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setSelected([]); // Clear selection when changing pages
  };

  const currentItems = images.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
          Hi, {artistName}
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
          <Button variant="contained" color="primary">
            Upload Artworks
          </Button>
        </Box>
        <Paper elevation={3} style={{ padding: "20px" }}>
          {images.length > 0 ? (
            <>
              <List>
                {currentItems.map((item) => (
                  <ArtListItem
                    key={item.id}
                    item={item}
                    isSelected={selected.includes(item.id)}
                    onEdit={openEditDialog}
                    onDelete={handleDelete}
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
                defaultValue={editItem.name}
                onChange={(e) =>
                  setEditItem({ ...editItem, name: e.target.value })
                }
              />
              <TextField
                autoFocus
                margin="dense"
                label="Image Price"
                type="text"
                fullWidth
                defaultValue={editItem.price}
                onChange={(e) =>
                  setEditItem({ ...editItem, price: e.target.value })
                }
              />
              <TextField
                autoFocus
                margin="dense"
                label="Image Tags (separated by comma)"
                type="text"
                fullWidth
                defaultValue={editItem.tags}
                onChange={(e) =>
                  setEditItem({ ...editItem, tags: e.target.value })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditItem(null)} color="primary">
                Cancel
              </Button>
              <Button onClick={() => handleEdit(editItem.name)} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Container>
    </Box>
  );
}

const dummyData = [
  { id: 1, name: "Image1.jpg" },
  { id: 2, name: "Image2.jpg" },
  { id: 3, name: "Image3.jpg" },
  { id: 4, name: "Image4.jpg" },
  { id: 5, name: "Image5.jpg" },
  { id: 6, name: "Image6.jpg" },
  { id: 7, name: "Image7.jpg" },
  { id: 8, name: "Image8.jpg" },
  { id: 9, name: "Image9.jpg" },
  { id: 10, name: "Image10.jpg" },
  { id: 11, name: "Image11.jpg" },
  { id: 12, name: "Image12.jpg" },
  { id: 13, name: "Image13.jpg" },
  { id: 14, name: "Image14.jpg" },
  { id: 15, name: "Image15.jpg" },
  { id: 16, name: "Image16.jpg" },
  { id: 17, name: "Image17.jpg" },
  { id: 18, name: "Image18.jpg" },
  { id: 19, name: "Image19.jpg" },
  { id: 20, name: "Image20.jpg" },
  { id: 21, name: "Image21.jpg" },
  { id: 22, name: "Image22.jpg" },
  { id: 23, name: "Image23.jpg" },
  { id: 24, name: "Image24.jpg" },
  { id: 25, name: "Image25.jpg" },
  { id: 26, name: "Image26.jpg" },
  { id: 27, name: "Image27.jpg" },
  { id: 28, name: "Image28.jpg" },
  { id: 29, name: "Image29.jpg" },
  { id: 30, name: "Image30.jpg" },
  { id: 31, name: "Image31.jpg" },
  { id: 32, name: "Image32.jpg" },
  { id: 33, name: "Image33.jpg" },
  { id: 34, name: "Image34.jpg" },
  { id: 35, name: "Image35.jpg" },
  { id: 36, name: "Image36.jpg" },
  { id: 37, name: "Image37.jpg" },
  { id: 38, name: "Image38.jpg" },
  { id: 39, name: "Image39.jpg" },
  { id: 40, name: "Image40.jpg" },
  { id: 41, name: "Image41.jpg" },
  { id: 42, name: "Image42.jpg" },
  { id: 43, name: "Image43.jpg" },
  { id: 44, name: "Image44.jpg" },
  { id: 45, name: "Image45.jpg" },
  { id: 46, name: "Image46.jpg" },
  { id: 47, name: "Image47.jpg" },
  { id: 48, name: "Image48.jpg" },
  { id: 49, name: "Image49.jpg" },
  { id: 50, name: "Image50.jpg" },
  { id: 51, name: "Image51.jpg" },
  { id: 52, name: "Image52.jpg" },
  { id: 53, name: "Image53.jpg" },
  { id: 54, name: "Image54.jpg" },
  { id: 55, name: "Image55.jpg" },
  { id: 56, name: "Image56.jpg" },
  { id: 57, name: "Image57.jpg" },
  { id: 58, name: "Image58.jpg" },
  { id: 59, name: "Image59.jpg" },
  { id: 60, name: "Image60.jpg" },
  { id: 61, name: "Image61.jpg" },
  { id: 62, name: "Image62.jpg" },
  { id: 63, name: "Image63.jpg" },
  { id: 64, name: "Image64.jpg" },
  { id: 65, name: "Image65.jpg" },
  { id: 66, name: "Image66.jpg" },
  { id: 67, name: "Image67.jpg" },
  { id: 68, name: "Image68.jpg" },
  { id: 69, name: "Image69.jpg" },
  { id: 70, name: "Image70.jpg" },
  { id: 71, name: "Image71.jpg" },
  { id: 72, name: "Image72.jpg" },
  { id: 73, name: "Image73.jpg" },
  { id: 74, name: "Image74.jpg" },
  { id: 75, name: "Image75.jpg" },
];
