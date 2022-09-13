import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardContent,
  Typography,
  CardActions,
  Divider,
} from "@mui/material";
import { Delete, Favorite, FavoriteBorder, Comment } from "@mui/icons-material";

import auth from "auth/auth-helper";
import { unlike, like, remove } from "./api-post";

import { IPost } from "types/Post";

interface IProps {
  post: IPost[];
  onRemove: (post: Partial<IPost>) => void;
}

export default function Post(props: IProps) {
  const jwt = auth.isAuthenticated();
  const checkLike = (likes) => {
    let match = likes.indexOf(jwt.user._id) !== -1;
    return match;
  };
  const [values, setValues] = useState({
    like: checkLike(props.post.likes),
    likes: props.post.likes.length,
    comments: props.post.comments,
  });

  // useEffect(() => {
  //   setValues({...values, like:checkLike(props.post.likes), likes: props.post.likes.length, comments: props.post.comments})
  // }, [])

  const clickLike = () => {
    let callApi = values.like ? unlike : like;
    callApi(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      props.post._id
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, like: !values.like, likes: data.likes.length });
      }
    });
  };

  const updateComments = (comments) => {
    setValues({ ...values, comments: comments });
  };

  const deletePost = () => {
    remove(
      {
        postId: props.post._id,
      },
      {
        t: jwt.token,
      }
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        props.onRemove(props.post);
      }
    });
  };

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "auto",
        marginBottom: 3,
        backgroundColor: "rgba(0, 0, 0, 0.06)",
      }}
    >
      <CardHeader
        avatar={<Avatar src={"/api/users/photo/" + props.post.postedBy._id} />}
        action={
          props.post.postedBy._id === auth.isAuthenticated().user._id && (
            <IconButton onClick={deletePost}>
              <Delete />
            </IconButton>
          )
        }
        title={
          <Link to={"/user/" + props.post.postedBy._id}>
            {props.post.postedBy.name}
          </Link>
        }
        subheader={new Date(props.post.created).toDateString()}
        sx={{
          paddingTop: 1,
          paddingBottom: 1,
        }}
      />
      <CardContent
        sx={{
          backgroundColor: "white",
          padding: `2px 0px`,
        }}
      >
        <Typography
          component="p"
          sx={{
            margin: 2,
          }}
        >
          {props.post.text}
        </Typography>
        {props.post.photo && (
          <div
            style={{
              textAlign: "center",
              backgroundColor: "#f2f5f4",
              padding: 1,
            }}
          >
            <img
              style={{
                height: 200,
              }}
              src={"/api/posts/photo/" + props.post._id}
              alt=""
            />
          </div>
        )}
      </CardContent>
      <CardActions>
        {values.like ? (
          <IconButton
            onClick={clickLike}
            sx={{
              margin: 1,
            }}
            aria-label="Like"
            color="secondary"
          >
            <Favorite />
          </IconButton>
        ) : (
          <IconButton
            onClick={clickLike}
            sx={{
              margin: 1,
            }}
            aria-label="Unlike"
            color="secondary"
          >
            <FavoriteBorder />
          </IconButton>
        )}{" "}
        <span>{values.likes}</span>
        <IconButton
          sx={{
            margin: 1,
          }}
          aria-label="Comment"
          color="secondary"
        >
          <Comment />
        </IconButton>{" "}
        <span>{values.comments.length}</span>
      </CardActions>
      <Divider />
      <Comments
        postId={props.post._id}
        comments={values.comments}
        updateComments={updateComments}
      />
    </Card>
  );
}
