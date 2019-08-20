import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import SocketContext from '../SocketContext';
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

const Login = props => {

	const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const classes = useStyles();

  useEffect(() => {
    props.socket.on('loggedIn', (data) => {
      console.log(data);
      if (data.error) {
        localStorage.removeItem("sessionKey", false);
      } else {
        localStorage.setItem("sessionKey", data.sessionKey);

        props.socket.off('loggedIn');

        return <Redirect to='/dasboard' />
      }
    });
  });
  if (!!localStorage.getItem("sessionKey")) return <Redirect to='/dashboard' />

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
          	onClick={(e) => { props.socket.emit('login', {user: username, pass: password})}}
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

const LoginWithSocket = props => (
	<SocketContext.Consumer>
		{socket => <Login {...props} socket={socket} />}
	</SocketContext.Consumer>
);

export default connect()(LoginWithSocket);