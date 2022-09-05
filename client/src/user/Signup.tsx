import {
  Card,
  CardContent,
  Typography,
  TextField,
  Icon,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";

import { create } from "./api-user";

export default function Signup() {
  const [values, setValues] = useState({
    name: "",
    password: "",
    email: "",
    open: false,
    error: "",
  });

  const handleChange =
    (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [name]: event.target.value });
    };

  const clickSubmit = () => {
    const user = {
      name: values.name,
      email: values.email,
      password: values.password,
    };
    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, error: "", open: true });
      }
    });
  };

  return (
    <div>
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
            Sign Up
          </Typography>
          <TextField
            id="name"
            label="Name"
            sx={{
              marginLeft: 1,
              marginRight: 1,
              width: 300,
            }}
            value={values.name}
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
      <Dialog open={values.open}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/signin">
            <Button color="primary" variant="contained">
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
}
