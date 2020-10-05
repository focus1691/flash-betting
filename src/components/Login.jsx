import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setLoggedIn } from '../actions/account';
import { getErrorMessage } from '../utils/ErrorMessages/AccountErrors';
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

const Login = ({ loggedIn, setLoggedIn }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['sessionKey', 'username', 'password', 'rememberMe']);

  const [rememberMe, setRememberMe] = useState(!!(cookies.rememberMe && cookies.rememberMe === 'yes'));

  const classes = useStyles();

  setLoggedIn(false);

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
    const { error, sessionKey } = data;

    console.log(data);

    // if (error) {
    //   removeCookie('sessionKey');
    //   removeCookie('username');
    //   removeCookie('password');
    //   setCookie('rememberMe', 'no');
    //   setRememberMe(false);

    //   window.location.href = `${window.location.origin}/?error=${error || 'GENERAL_AUTH_ERROR'}`;
    // } else {
    //   setCookie('sessionKey', sessionKey);
    //   setCookie('username', email.value);
    //   setCookie('password', password.value);
    //   setCookie('rememberMe', 'yes');

    //   setRememberMe(true);

    //   setLoggedIn(true);
    // }
  };

  return (
    <>
      {loggedIn && cookies.sessionKey ? <Redirect to="/dashboard" /> : null}
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
              padding: getQueryVariable('error') ? 2 : 0,
              textAlign: 'center',
              color: 'white',
            }}
          >
            {getErrorMessage(getQueryVariable('error'))}
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email Address" name="email" value={cookies.username} autoComplete="email" autoFocus />
            <TextField variant="outlined" margin="normal" required fullWidth name="password" value={cookies.password} label="Password" type="password" id="password" autoComplete="current-password" />
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" checked={rememberMe} onChange={(e, checked) => setRememberMe(checked)} />
            <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
              Sign In
            </Button>
          </form>
        </div>
      </Container>
    </>
  );
};

const mapStateToProps = (state) => ({
  loggedIn: state.account.loggedIn,
});

const mapDispatchToProps = { setLoggedIn };

export default connect(mapStateToProps, mapDispatchToProps)(Login);
