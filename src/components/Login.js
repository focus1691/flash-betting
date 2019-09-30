import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions/account";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: "theme.palette.common.white"
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFB80C",
    borderRadius: "25px",
    border: "5px solid #000"
  },
  avatar: {
    margin: theme.spacing(1)
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    margin: theme.spacing(5),
    padding: "25px"
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const Login = props => {
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [password, setPassword] = useState(
    localStorage.getItem("password") || ""
  );
  const [rememberMe, setRememberMe] = useState(
    !!localStorage.getItem("rememberMe") || false
  );
  const [sessionKey, setSessionKey] = useState(
    !!localStorage.getItem("sessionKey")
  );

  const classes = useStyles();

  props.onLogin(false);

  useEffect(() => {
    if (!!localStorage.getItem("sessionKey")) {
      let sessionKey = localStorage.getItem("sessionKey");
      let email = localStorage.getItem("username");

      fetch(
        `/api/load-session?sessionKey=${encodeURIComponent(
          sessionKey
        )}&email=${encodeURIComponent(email)}`
      );
    }
  });

  const handleSubmit = e => {
    fetch(`/api/login?user=${username}&pass=${password}`)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          localStorage.removeItem("sessionKey", false);
          localStorage.removeItem("username");
          localStorage.removeItem("password");
          localStorage.removeItem("rememberMe");
        } else {
          localStorage.setItem("sessionKey", res.sessionKey);
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);

          if (rememberMe) localStorage.setItem("rememberMe", "yes");

          setSessionKey(res.sessionKey);

          props.onLogin(true);
        }
      });
  };

  const handleRememberMe = checked => {
    setRememberMe(checked);
  };

  return (
    <>
      {props.loggedIn && !!sessionKey ? <Redirect to="/authentication" /> : null}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <img
            src={window.location.origin + "/images/Webp.net-resizeimage.png"}
            alt="Betfair"
            className={classes.avatar}
          />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              value={username}
              onChange={e => {
                setUsername(e.target.value);
              }}
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
              }}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
              checked={rememberMe}
              onChange={(e, checked) => handleRememberMe(checked)}
            />
            <Button
              onClick={e => handleSubmit(e)}
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Container>
    </>
  );
};

const mapStateToProps = state => {
  return {
    loggedIn: state.account.loggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin: loggedIn => dispatch(actions.setLoggedIn(loggedIn))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
