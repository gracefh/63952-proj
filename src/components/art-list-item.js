import React from "react";
import {
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function ArtListItem({
  item,
  isSelected,
  onEdit,
  onDelete,
  onCheck,
}) {
  return (
    <Card variant="outlined" style={{ marginBottom: "10px" }}>
      <CardContent>
        <ListItem>
          <Checkbox
            edge="start"
            checked={isSelected}
            onChange={(e) => onCheck(item.id, e.target.checked)}
          />
          <ListItemText primary={item.name} />
          <IconButton aria-label="edit" onClick={() => onEdit(item)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => onDelete(item.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      </CardContent>
    </Card>
  );
}
