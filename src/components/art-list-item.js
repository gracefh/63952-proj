import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Card,
  CardContent,
  Chip,
  CardMedia,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

export default function ArtListItem({
  item,
  isSelected,
  onEdit,
  onDelete,
  onCheck,
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const price = item.price || 0;
  const tags = item.tags || [];

  const handleImageClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Card variant="outlined" style={{ marginBottom: "10px" }}>
      <CardContent>
        <ListItem>
          <Checkbox
            edge="start"
            checked={isSelected}
            onChange={(e) => onCheck(item.id, e.target.checked)}
          />
          <CardMedia
            component="img"
            image={item.link}
            alt={item.title}
            style={{
              width: 100,
              height: 100,
              cursor: "pointer",
              marginRight: "16px",
            }}
            onClick={handleImageClick}
          />
          <Grid
            container
            direction="row"
            style={{ flexGrow: 1, marginRight: "16px" }}
            alignItems="center"
            spacing={2}
          >
            <Grid item xs>
              <ListItemText primary={item.title} />
              <ListItemText secondary={`Price: $${price}`} />
            </Grid>
            <Grid item>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  style={{ marginRight: "5px" }}
                />
              ))}
            </Grid>
          </Grid>
          <IconButton aria-label="edit" onClick={() => onEdit(item)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => onDelete(item.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      </CardContent>

      {/* Dialog for Image Preview */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogActions>
          <IconButton onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent>
          <img src={item.link} alt={item.title} style={{ maxWidth: "100%" }} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
