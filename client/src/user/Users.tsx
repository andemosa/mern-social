import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Person, ArrowForward } from "@mui/icons-material";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from "@mui/material";

import { list } from "./api-user";

import { IProfile } from "types/User";

export default function Users() {
  const [users, setUsers] = useState<IProfile[]>([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    list(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setUsers(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <Paper
      sx={{
        padding: 1,
        margin: 5,
      }}
      elevation={4}
    >
      <Typography
        variant="h6"
        sx={{
          margin: 2,
          color: "theme.palette.openTitle",
        }}
      >
        All Users
      </Typography>
      <List
        dense
        sx={{
          "& a": {
            color: "#3f4771",
            textDecoration: "none"
          },
        }}
      >
        {users?.map((item, i) => {
          return (
            <Link to={"/user/" + item._id} key={i}>
              <ListItem button>
                <ListItemAvatar>
                  <Avatar>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={item.name} />
                <ListItemSecondaryAction>
                  <IconButton>
                    <ArrowForward />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Link>
          );
        })}
      </List>
    </Paper>
  );
}
