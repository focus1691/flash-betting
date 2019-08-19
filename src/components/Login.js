import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:8000");

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: "theme.palette.common.white",
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: "#FFB80C",
    borderRadius: "25px",
    border: "5px solid #000",
  },
  avatar: {
    margin: theme.spacing(1),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    margin: theme.spacing(5),
    padding: "25px",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default (callback) => {

	const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const classes = useStyles();

  localStorage.clear();

  useEffect(() => {
    socket.on('loggedIn', (data) => {
      if (data.error) {
        localStorage.removeItem("loggedIn", false);
        localStorage.removeItem("sessionKey", false);
      } else {
        console.log('set');
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("sessionKey", data.sessionKey);

        socket.off('loggedIn');

        return <Redirect to='/authentication' />
      }
    });
  });
  if (localStorage.getItem("sessionKey")) return <Redirect to='/authentication' />

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <img src={window.location.origin + '/images/Webp.net-resizeimage.png'} alt="Betfair" className={classes.avatar}/>
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
            onChange={(e) => {setUsername(e.target.value)}}
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            onChange={(e) => {setPassword(e.target.value)}}
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
          	onClick={(e) => { socket.emit('login', {user: username, pass: password})}}
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
  );
}