import { useState, useEffect } from "react";
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
  Button,
  Snackbar,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { Link } from "react-router-dom";

import auth from "auth/auth-helper";
import { findPeople, follow } from "./api-user";
import { IProfile } from "types/User";

interface IState {
  users?: IProfile[];
  open: boolean;
  followMessage: string;
}

export default function FindPeople() {
  const [values, setValues] = useState<IState>({
    users: [],
    open: false,
    followMessage: "",
  });
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    findPeople(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      signal
    ).then((data: any) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, users: data });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const clickFollow = (user: IProfile, index: number) => {
    follow(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      user._id
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        let toFollow = values.users!;
        toFollow.splice(index, 1);
        setValues({
          ...values,
          users: toFollow,
          open: true,
          followMessage: `Following ${user.name}!`,
        });
      }
    });
  };

  const handleRequestClose = () => {
    setValues({ ...values, open: false });
  };

  return (
    <div>
      <Paper
        sx={{
          padding: 1,
          margin: 0,
        }}
        elevation={4}
      >
        <Typography
          variant="h3"
          sx={{
            margin: 2,
            color: "theme.palette.openTitle",
            fontSize: "1em",
          }}
        >
          Who to follow
        </Typography>
        <List>
          {values?.users &&
            values?.users.map((item, i) => {
              return (
                <span key={i}>
                  <ListItem>
                    <ListItemAvatar
                      sx={{
                        marginRight: 1,
                      }}
                    >
                      <Avatar src={"/api/users/photo/" + item._id} />
                    </ListItemAvatar>
                    <ListItemText primary={item.name} />
                    <ListItemSecondaryAction
                      sx={{
                        right: 2,
                      }}
                    >
                      <Link to={"/user/" + item._id}>
                        <IconButton
                          color="secondary"
                          sx={{
                            verticalAlign: "middle",
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Link>
                      <Button
                        aria-label="Follow"
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          clickFollow(item, i);
                        }}
                      >
                        Follow
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                </span>
              );
            })}
        </List>
      </Paper>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={values.open}
        onClose={handleRequestClose}
        autoHideDuration={6000}
        message={<span>{values.followMessage}</span>}
      />
    </div>
  );
}
