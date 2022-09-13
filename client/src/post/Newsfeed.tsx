import { useState, useEffect } from "react";
import { Card, Typography, Divider } from "@mui/material";

import NewPost from "./NewPost";

import auth from "auth/auth-helper";
import { listNewsFeed } from "./api-post";

import { IPost } from "types/Post";

export default function Newsfeed() {
  const [posts, setPosts] = useState<Partial<IPost>[]>([]);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listNewsFeed(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      signal
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  const addPost = (post: Partial<IPost>) => {
    const updatedPosts = [...posts];
    updatedPosts.unshift(post);
    setPosts(updatedPosts);
  };

  const removePost = (post: Partial<IPost>) => {
    const updatedPosts = [...posts];
    const index = updatedPosts.indexOf(post);
    updatedPosts.splice(index, 1);
    setPosts(updatedPosts);
  };

  return (
    <Card
      sx={{
        margin: "auto",
        paddingTop: 0,
        paddingBottom: 3,
      }}
    >
      <Typography
        component={"h2"}
        sx={{
          padding: 2,
          fontSize: "1em",
        }}
      >
        Newsfeed
      </Typography>
      <Divider />
      <NewPost addUpdate={addPost} />
      <Divider />
      <PostList removeUpdate={removePost} posts={posts} />
    </Card>
  );
}
