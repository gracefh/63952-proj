import React from "react";
import {
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Card,
  CardContent,
  Chip,
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
  const price = item.price || 0;
  const tags = item.tags || [];

  return (
    <Card variant="outlined" style={{ marginBottom: "10px" }}>
      <CardContent>
        <ListItem>
          <Checkbox
            edge="start"
            checked={isSelected}
            onChange={(e) => onCheck(item.id, e.target.checked)}
          />
          <ListItemText
            primary={item.name}
            secondary={`Price: $${price}`} // Displaying the price
          />
          <div>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                style={{ marginRight: "5px", backgroundColor: "yourColorHere" }} // You can customize the color here
              />
            ))}
          </div>
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
