import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

const ArtCard = ({ card }) => {
  const imageUrl = `https://source.unsplash.com/random?wallpapers&sig=${card.id}`;

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
          {card.name}
        </Typography>
        <Typography component="h3">{card.artist}</Typography>
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
          ${card.price}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button size="small">View</Button>
        <Button size="small">Add</Button>
      </CardActions>
    </Card>
  );
};

export default ArtCard;
