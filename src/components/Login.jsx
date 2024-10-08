import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
//* @material-ui core
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
//* Utils
import errorList from '../utils/Errors/AuthErrors';
import getQueryVariable from '../utils/Market/GetQueryVariable';
//* JSS
import useStyles from '../jss/components/Login';
//* Session
import { clearCookies } from '../session/cleanup';

const cookies = new Cookies();

const Login = () => {
  const classes = useStyles();
  const [authPending, setAuthPending] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState('');
  const [sessionKey, setSessionKey] = useState(cookies.get('sessionKey'));

  useEffect(() => {
    const errorCode = getQueryVariable('error');
    const error = errorList[errorCode];
    if (error) {
      clearCookies(cookies);
      setSessionKey(null);
      setError(error);
    }
    setIsProcessing(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthPending(true);
    let {
      password: { value: password },
    } = e.currentTarget;
    const {
      email: { value: user },
      twofactorauthentication: { value: twoFactorAuthentication },
    } = e.currentTarget;

    if (twoFactorAuthentication) {
      password = password.concat(twoFactorAuthentication);
    }

    const response = await fetch('/api/login', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ user, password }),
    });
    const data = await response.json();
    const { error } = data;
    const sessionKey = cookies.get('sessionKey');

    if (error) {
      setError(errorList[error] || errorList.UNKNOWN_ERROR);
    } else if (sessionKey) {
      setError('');
      setSessionKey(sessionKey);
    }
    setAuthPending(false);
  };

  return (
    <>
      {sessionKey && !isProcessing && _.isEmpty(error) ? <Redirect to="/dashboard" /> : null}
      <CssBaseline />
      <Box className={classes.box}>
        <Box className={classes.background} />
        <img src={`${window.location.origin}/images/logo.png`} alt="" className={classes.logo} />
        <div className={classes.login}>
          <Box className={classes.loginBackground} />
          <Typography component="h1" className={classes.titleText}>
            SIGN IN
          </Typography>
          <Typography className={classes.welcomeText} component="p">
            Welcome to Flash Betting
          </Typography>
          <Typography component="p" className={classes.errorText}>
            {error}
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              className={classes.loginTextField}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Username / Email Address"
              name="email"
              autoComplete="email"
              placeholder="Enter your Email"
              autoFocus
              InputProps={{
                className: classes.loginInput,
              }}
            />
            <TextField
              className={classes.loginTextField}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your Password"
              InputProps={{
                className: classes.loginInput,
              }}
            />
            <TextField
              className={classes.loginTextField}
              variant="outlined"
              margin="normal"
              fullWidth
              name="twofactorauthentication"
              label="2FA"
              type="text"
              autoComplete="2fa"
              placeholder="2FA"
              InputProps={{
                className: classes.loginInput,
              }}
            />
            <div className={classes.submit}>
              <Button type="submit" fullWidth variant="contained" disabled={authPending}>
                Sign In
              </Button>
            </div>
            <Typography className={classes.helpText} component="p">
              Dont have an account?
              <Link href="https://register.betfair.com/account/registration" rel="noopener" target="_blank" className={classes.registerLink}>
                SIGN UP
              </Link>
            </Typography>
          </form>
        </div>
      </Box>
    </>
  );
};

export default Login;
