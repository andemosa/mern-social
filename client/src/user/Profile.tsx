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

interface IState {
  user: Partial<IProfile>;
  redirectToSignin: boolean;
  following: boolean;
}

export default function Profile() {
  let params = useParams();
  const [values, setValues] = useState<IState>({
    user: { following: [], followers: [] },
    redirectToSignin: false,
    following: false,
  });
  const [posts, setPosts] = useState([]);
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
        setValues({ ...values, redirectToSignin: true });
      } else {
        let following = checkFollow(data);
        setValues({ ...values, user: data, following: following });
        loadPosts(data._id);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, [jwt.token, params.userId]);

  const checkFollow = (user) => {
    const match = user.followers.some((follower) => {
      return follower._id == jwt.user._id;
    });
    return match;
  };

  const clickFollowButton = (callApi) => {
    callApi(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      values.user._id
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, user: data, following: !values.following });
      }
    });
  };

  const loadPosts = (user) => {
    listByUser(
      {
        userId: user,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });
  };
  const removePost = (post) => {
    const updatedPosts = posts;
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    setPosts(updatedPosts);
  };

  const photoUrl = values.user._id
    ? `/api/users/photo/${values.user._id}?${new Date().getTime()}`
    : "/api/users/defaultphoto";

  if (values.redirectToSignin) {
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
            <Avatar
              src={photoUrl}
              sx={{
                width: 60,
                height: 60,
                margin: 10,
              }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={values.user.name}
            secondary={values.user.email}
          />{" "}
          {auth.isAuthenticated().user &&
          auth.isAuthenticated().user?._id === values?.user?._id ? (
            <ListItemSecondaryAction>
              <Link to={"/user/edit/" + values.user._id}>
                <IconButton aria-label="Edit" color="primary">
                  <Edit />
                </IconButton>
              </Link>
              <DeleteUser userId={values.user._id!} />
            </ListItemSecondaryAction>
          ) : // <FollowProfileButton
          //   following={values.following}
          //   onButtonClick={clickFollowButton}
          // />
          null}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={
              "Joined: " + new Date(values.user.createdAt!).toDateString()
            }
          />
        </ListItem>
      </List>
      {/* <ProfileTabs user={values.user} posts={posts} removePostUpdate={removePost}/> */}
    </Paper>
  );
}
