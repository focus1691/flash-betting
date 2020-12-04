import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

const Logout = () => {
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
      const logout = async () => {
        await fetch('/api/logout');
        setLoggedIn(false);
      };
      logout();
  }, []);

  return (
    <>
      {loggedIn ? null : <Redirect to="/" />}
      <section>Logging out...</section>
    </>
  );
};

export default Logout;
