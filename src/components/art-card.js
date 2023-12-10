import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart } from "../CartContext";

const ArtCard = ({ card }) => {
  const imageUrl = card.link;
  const [open, setOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { addToCart, removeFromCart } = useCart();

  const handleAddOrDelete = () => {
    setIsAdded(!isAdded);
    if (!isAdded) {
      addToCart(card);
    } else {
      removeFromCart(card.id);
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardMedia
        component="div"
        sx={{
          pt: "56.25%",
        }}
        image={imageUrl}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {card.title}
        </Typography>
        <Typography component="h3">{card.author}</Typography>
        <Stack
          direction="row"
          justifyContent="center"
          flexWrap="wrap"
          gap={0.5}
          mt={1}
        >
          {card.tags.map((tag, index) => (
            <Chip key={index} label={tag} size="small" />
          ))}
        </Stack>
      </CardContent>
      <CardActions>
        <Typography component="h3" sx={{ mr: 2, ml: 2 }}>
          {card.price === 0 ? "FREE" : `$${card.price}`}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button size="small" onClick={handleOpen}>
          View
        </Button>
        <IconButton size="small" onClick={handleAddOrDelete}>
          {isAdded ? <DeleteIcon /> : <AddShoppingCartIcon />}
        </IconButton>
      </CardActions>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <img src={imageUrl} alt={card.title} style={{ width: "100%" }} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ArtCard;
