import { Icon, CardHeader, Avatar, TextField } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

import auth from "auth/auth-helper";
import { comment, uncomment } from "./api-post";

interface IProps {
  postId: string;
  comments: any[];
  updateComments: () => void;
}

export default function Comments(props: IProps) {
  const [text, setText] = useState("");
  const jwt = auth.isAuthenticated();
  const handleChange = (event) => {
    setText(event.target.value);
  };

  const addComment = (event) => {
    if (event.keyCode === 13 && event.target.value) {
      event.preventDefault();
      comment(
        {
          userId: jwt.user._id,
        },
        {
          t: jwt.token,
        },
        props.postId,
        { text: text }
      ).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setText("");
          props.updateComments(data.comments);
        }
      });
    }
  };

  const deleteComment = (comment) => (event) => {
    uncomment(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      props.postId,
      comment
    ).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        props.updateComments(data.comments);
      }
    });
  };

  const commentBody = (item) => {
    return (
      <p
        style={{
          backgroundColor: "white",
          padding: 1,
          margin: `2px`,
        }}
      >
        <Link to={"/user/" + item.postedBy._id}>{item.postedBy.name}</Link>
        <br />
        {item.text}
        <span
          style={{
            display: "block",
            color: "gray",
            fontSize: "0.8em",
          }}
        >
          {new Date(item.created).toDateString()} |
          {auth.isAuthenticated().user._id === item.postedBy._id && (
            <Icon
              onClick={deleteComment(item)}
              sx={{
                fontSize: "1.6em",
                verticalAlign: "middle",
                cursor: "pointer",
              }}
            >
              delete
            </Icon>
          )}
        </span>
      </p>
    );
  };

  return (
    <div>
      <CardHeader
        avatar={
          <Avatar
            sx={{
              width: 25,
              height: 25,
            }}
            src={"/api/users/photo/" + auth.isAuthenticated().user._id}
          />
        }
        title={
          <TextField
            onKeyDown={addComment}
            multiline
            value={text}
            onChange={handleChange}
            placeholder="Write something ..."
            sx={{
              width: "96%",
            }}
            margin="normal"
          />
        }
        sx={{
          paddingTop: 1,
          paddingBottom: 1,
        }}
      />
      {props.comments.map((item, i) => {
        return (
          <CardHeader
            avatar={
              <Avatar
                sx={{
                  width: 25,
                  height: 25,
                }}
                src={"/api/users/photo/" + item.postedBy._id}
              />
            }
            title={commentBody(item)}
            sx={{
              paddingTop: 1,
              paddingBottom: 1,
            }}
            key={i}
          />
        );
      })}
    </div>
  );
}
