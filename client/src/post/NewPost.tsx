import { useState, useEffect } from "react";
import { PhotoCamera } from "@mui/icons-material";
import {
  Card,
  CardHeader,
  Avatar,
  CardContent,
  TextField,
  IconButton,
  Typography,
  Icon,
  CardActions,
  Button,
} from "@mui/material";

import auth from "auth/auth-helper";
import { create } from "./api-post";

import { IPost } from "types/Post";

interface IProps {
  addUpdate: (post: Partial<IPost>) => void;
}

export default function NewPost(props: IProps) {
  const [values, setValues] = useState({
    text: "",
    photo: "",
    error: "",
    user: {},
  });

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    setValues({ ...values, user: auth.isAuthenticated().user });
  }, []);

  const clickPost = () => {
    let postData = new FormData();
    postData.append("text", values.text);
    postData.append("photo", values.photo);
    create(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      postData
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, text: "", photo: "" });
        props.addUpdate(data);
      }
    });
  };

  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };
  
  const photoURL = values.user._id
    ? "/api/users/photo/" + values.user._id
    : "/api/users/defaultphoto";

  return (
    <div
      style={{
        backgroundColor: "#efefef",
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          margin: "auto",
          marginBottom: 3,
          backgroundColor: "rgba(65, 150, 136, 0.09)",
          boxShadow: "none",
        }}
      >
        <CardHeader
          avatar={<Avatar src={photoURL} />}
          title={values.user.name}
          sx={{
            paddingTop: 8,
            paddingBottom: 8,
          }}
        />
        <CardContent
          sx={{
            backgroundColor: "white",
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <TextField
            placeholder="Share your thoughts ..."
            multiline
            rows="3"
            value={values.text}
            onChange={handleChange("text")}
            sx={{
              marginLeft: 2,
              marginRight: 2,
              width: "90%",
            }}
            margin="normal"
          />
          <input
            accept="image/*"
            onChange={handleChange("photo")}
            style={{
              display: "none",
            }}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <IconButton
              color="secondary"
              sx={{
                height: 30,
                marginBottom: 5,
              }}
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>{" "}
          <span className={classes.filename}>
            {values.photo ? values.photo.name : ""}
          </span>
          {values.error && (
            <Typography component="p" color="error">
              <Icon
                color="error"
                sx={{
                  verticalAlign: "middle",
                }}
              >
                error
              </Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            disabled={values.text === ""}
            onClick={clickPost}
            sx={{
              margin: 2,
            }}
          >
            POST
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
