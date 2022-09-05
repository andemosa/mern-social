import { ChangeEvent, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Icon,
  CardActions,
  Button,
} from "@mui/material";

import { signin } from "./api.auth";
import auth from "./auth-helper";

export default function Signin() {
  const location = useLocation();

  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    redirectToReferrer: false,
  });

  const clickSubmit = () => {
    const user = {
      email: values.email,
      password: values.password,
    };

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        auth.authenticate(data, () => {
          setValues({ ...values, error: "", redirectToReferrer: true });
        });
      }
    });
  };

  const handleChange =
    (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [name]: event.target.value });
    };

  let from =
    (location.state as { from: { pathname: string } })?.from?.pathname || "/";

  const { redirectToReferrer } = values;
  if (redirectToReferrer) {
    return <Navigate to={from} />;
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
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Sign In
        </Typography>
        <TextField
          id="email"
          type="email"
          label="Email"
          sx={{
            marginLeft: 1,
            marginRight: 1,
            width: 300,
          }}
          value={values.email}
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
          value={values.password}
          onChange={handleChange("password")}
          margin="normal"
        />
        <br />{" "}
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
