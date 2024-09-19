import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import fetchData from '../http/fetchData';
import { clearCookies } from '../session/cleanup';
import { BETFAIR_LOGIN_PAGE } from '../constants';

const cookies = new Cookies();

const Authentication = () => {
  const [sessionKey, setSessionKey] = useState(cookies.get('sessionKey'));

  useEffect(() => {
    const resetSession = () => {
      clearCookies(cookies);
      setSessionKey(null);
    };

    (async () => {
      if (sessionKey) {
        let errorOccurred = false;
        try {
          const { vendorId } = await fetchData('/api/vendor-id');

          if (!vendorId) {
            throw new Error();
          }

          window.location = `${BETFAIR_LOGIN_PAGE}?client_id=${vendorId}&response_type=code&redirect_uri=validation`;
        } catch (error) {
          console.log(`ERROR: Authentication ${error}`);
          errorOccurred = true;
        } finally {
          if (errorOccurred) {
            resetSession();
          }
        }
      }
    })();
  }, []);
  return !sessionKey ? <Redirect to="/" /> : <Redirect to="/dashboard" />;
};

export default Authentication;
