import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Person, Edit } from "@mui/icons-material";
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
  Divider,
} from "@mui/material";

import auth from "auth/auth-helper";
import { read } from "./api-user";

import { IProfile } from "types/User";
import DeleteUser from "./DeleteUser";

export default function Profile() {
  let params = useParams();
  const [user, setUser] = useState<IProfile | null>(null);
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: params.userId!,
      },
      { t: jwt.token },
      signal
    ).then((data: any) => {
      if (data && data.error) {
        setRedirectToSignin(true);
      } else {
        setUser(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [jwt.token, params.userId]);

  if (redirectToSignin) {
    return <Navigate to="/signin" />;
  }
  return (
    <Paper
      sx={{
        maxWidth: 600,
        margin: "auto",
        padding: 3,
        marginTop: 5,
      }}
      elevation={4}
    >
      <Typography
        variant="h6"
        sx={{
          marginTop: 3,
        }}
      >
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <Person />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user?.name} secondary={user?.email} />{" "}
          {auth.isAuthenticated().user &&
            auth.isAuthenticated().user?._id === user?._id && (
              <ListItemSecondaryAction>
                <Link to={"/user/edit/" + user?._id}>
                  <IconButton aria-label="Edit" color="primary">
                    <Edit />
                  </IconButton>
                </Link>
                <DeleteUser userId={user?._id!} />
              </ListItemSecondaryAction>
            )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={"Joined: " + new Date(user?.createdAt!).toDateString()}
          />
        </ListItem>
      </List>
    </Paper>
  );
}
