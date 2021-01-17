import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
//* @material-ui core
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
//* Utils
import authErrors from '../utils/Errors/AuthErrors';
import getQueryVariable from '../utils/Market/GetQueryVariable';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: 'theme.palette.common.white',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFB80C',
    borderRadius: '25px',
    border: '5px solid #000',
  },
  avatar: {
    margin: theme.spacing(1),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    margin: theme.spacing(5),
    padding: '25px',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const cookies = new Cookies();

const Login = () => {
  const [error, setError] = useState(authErrors[getQueryVariable('error')] || '');
  const [sessionKey, setSessionKey] = useState(cookies.get('sessionKey'));

  const classes = useStyles();

  useEffect(() => {
    if (error) {
      cookies.remove('username');
      cookies.remove('sessionKey');
      cookies.remove('accessToken');
      setSessionKey(null);
      setError('');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = e.currentTarget;
    const response = await fetch('/api/login', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ user: email.value, password: password.value }),
    });
    const data = await response.json();
    const { error } = data;
    const sessionKey = (cookies.get('sessionKey'));

    if (error) {
      setError(authErrors[error] || authErrors.GENERAL_AUTH_ERROR);
    }
    else if (cookies.get('sessionKey')) {
      setError('');
      setSessionKey(sessionKey);
    }
  };

  return (
    <>
      {sessionKey ? <Redirect to="/authentication" /> : null}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <img src={`${window.location.origin}/images/Webp.net-resizeimage.png`} alt="Betfair" className={classes.avatar} />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Typography
            component="p"
            style={{
              backgroundColor: '#C71585',
              marginTop: '1%',
              width: '100%',
              padding: error ? 2 : 0,
              textAlign: 'center',
              color: 'white',
            }}
          >
            {error}
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField variant="outlined" margin="normal" required fullWidth label="Email Address" name="email" autoComplete="email" autoFocus />
            <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password" type="password" autoComplete="current-password" />
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Sign In
            </Button>
          </form>
        </div>
      </Container>
    </>
  );
};

export default Login;
