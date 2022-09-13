import { useState, useEffect, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Edit } from "@mui/icons-material";
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
import { listByUser } from "post/api-post";

import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";

import { IProfile } from "types/User";

interface IState {
  user: Partial<IProfile>;
  redirectToSignin: boolean;
  following: boolean;
  error?: any;
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

  const checkFollow = useMemo(
    () => (user: { followers: IProfile[] }) => {
      const match = user?.followers.some((follower) => {
        return follower._id === jwt.user?._id;
      });
      return match;
    },
    [jwt.user?._id]
  );

  const loadPosts = useMemo(
    () => (user: string) => {
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
    },
    [jwt.token]
  );

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
  }, [checkFollow, loadPosts, jwt.token, params.userId]);

  const clickFollowButton = (
    callApi: (
      arg0: { userId: string },
      arg1: { t: string },
      arg2: string
    ) => Promise<any>
  ) => {
    callApi(
      {
        userId: jwt.user?._id,
      },
      {
        t: jwt.token,
      },
      values.user?._id!
    ).then((data: any) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, user: data, following: !values.following });
      }
    });
  };

  // const removePost = (post) => {
  //   const updatedPosts = posts;
  //   const index = updatedPosts.indexOf(post);
  //   updatedPosts.splice(index, 1);
  //   setPosts(updatedPosts);
  // };

  const photoUrl = values?.user?._id
    ? `${process.env.REACT_APP_BASE_URL}/api/users/photo/${
        values?.user?._id
      }?${new Date().getTime()}`
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
            primary={values.user?.name}
            secondary={values.user?.email}
          />{" "}
          {auth.isAuthenticated().user &&
          auth.isAuthenticated().user?._id === values?.user?._id ? (
            <ListItemSecondaryAction>
              <Link to={"/user/edit/" + values.user?._id}>
                <IconButton aria-label="Edit" color="primary">
                  <Edit />
                </IconButton>
              </Link>
              <DeleteUser userId={values.user?._id!} />
            </ListItemSecondaryAction>
          ) : (
            <FollowProfileButton
              following={values.following}
              onButtonClick={clickFollowButton}
            />
          )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={
              "Joined: " + new Date(values.user?.createdAt!).toDateString()
            }
          />
        </ListItem>
      </List>
      {/* <ProfileTabs user={values.user} posts={posts} removePostUpdate={removePost}/> */}
    </Paper>
  );
}
