import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setLoggedIn } from '../actions/account';

const Logout = ({ loggedIn, setLoggedIn }) => {
  const [removeCookie] = useCookies(['sessionKey', 'accessToken', 'refreshToken', 'expiresIn']);
  useEffect(() => {
    fetch('/api/logout')
      .then((res) => res.json())
      .then(() => {
        removeCookie('sessionKey');
        removeCookie('accessToken');
        removeCookie('refreshToken');
        removeCookie('expiresIn');

        setLoggedIn(false);
      });
  }, []);

  return (
    <>
      {loggedIn ? null : <Redirect to="/" />}
      <section>Logging out...</section>
    </>
  );
};

