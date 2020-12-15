import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

const Logout = () => {
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    (async () => {
      await fetch('/api/logout');
      setLoggedIn(false);
    })();
  }, []);

  return (
    <>
      {loggedIn ? null : <Redirect to="/" />}
      <section>Logging out...</section>
    </>
  );
};

export default Logout;
