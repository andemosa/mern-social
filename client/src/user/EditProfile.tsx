import { useState, useEffect, ChangeEvent } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Icon,
  CardActions,
  Button,
} from "@mui/material";

import auth from "auth/auth-helper";
import { read, update } from "./api-user";


export default function EditProfile() {
  let params = useParams();
  const [values, setValues] = useState({
    name: "",
    password: "",
    email: "",
    open: false,
    error: "",
    redirectToProfile: false,
    userId: ""
  });
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
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, name: data?.name, email: data?.email });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.userId]);

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };
    update(
      {
        userId: params.userId!,
      },
      {
        t: jwt.token,
      },
      user
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, userId: data._id, redirectToProfile: true });
      }
    });
  };
  const handleChange =
    (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [name]: event.target.value });
    };

  if (values.redirectToProfile) {
    return <Navigate to={"/user/" + values.userId} />;
  }
  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "auto",
        textAlign: "center",
        marginTop: 5,
        paddingBottom: 2,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            margin: 2,
          }}
        >
          Edit Profile
        </Typography>
        <TextField
          id="name"
          label="Name"
          sx={{
            marginLeft: 1,
            marginRight: 1,
            width: 300,
          }}
          value={values?.name}
          onChange={handleChange("name")}
          margin="normal"
        />
        <br />
        <TextField
          id="email"
          type="email"
          label="Email"
          sx={{
            marginLeft: 1,
            marginRight: 1,
            width: 300,
          }}
          value={values?.email}
          onChange={handleChange("email")}
          margin="normal"
        />
        <br />
        <TextField
          id="password"
          type="password"
          label="Password"
          sx={{
            marginLeft: 1,
            marginRight: 1,
            width: 300,
          }}
          value={values?.password}
          onChange={handleChange("password")}
          margin="normal"
        />
        <br />{" "}
        {values?.error && (
          <Typography component="p" color="error">
            <Icon
              color="error"
              sx={{
                verticalAlign: "middle",
              }}
            >
              error
            </Icon>
            {values?.error}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          onClick={clickSubmit}
          sx={{
            margin: "auto",
            marginBottom: 2,
          }}
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  );
}
