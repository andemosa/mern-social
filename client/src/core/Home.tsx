// import { makeStyles } from '@material-ui/core/styles'
// import Card from '@material-ui/core/Card'
// import CardContent from '@material-ui/core/CardContent'
// import CardMedia from '@material-ui/core/CardMedia'
// import Typography from '@material-ui/core/Typography'
import { Card, Typography, CardMedia, CardContent } from "@mui/material";

import unicornbikeImg from "assets/images/unicornbike.jpg";

export default function Home() {
  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "auto",
        marginTop: 5,
        marginBottom: 5,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          padding: 3,
        }}
      >
        Home Page
      </Typography>
      <CardMedia
        sx={{
          minHeight: 400,
        }}
        image={unicornbikeImg}
        title="Unicorn Bicycle"
      />
      <Typography
        variant="body2"
        component="p"
        sx={{
          padding: 2,
          textAlign: "right",
          backgroundColor: "#ededed",
          borderBottom: "1px solid #d0d0d0",
          "& a": {
            color: "#3f4771",
          },
        }}
        color="textSecondary"
      >
        Photo by{" "}
        <a
          href="https://unsplash.com/@boudewijn_huysmans"
          target="_blank"
          rel="noopener noreferrer"
        >
          Boudewijn Huysmans
        </a>{" "}
        on Unsplash
      </Typography>
      <CardContent>
        <Typography variant="body1" component="p">
          Welcome to the MERN Social home page.
        </Typography>
      </CardContent>
    </Card>
  );
}
