import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
//* Actions
import { setAccountDetails, setBalance } from '../../actions/account';
import FlagIcon from './FlagIcon';
import Clock from './Clock';
import { formatCurrency } from '../../utils/NumberFormat';
//* HTTP
import fetchData from '../../http/fetchData';

const cookies = new Cookies();

const Account = ({ name, countryCode, currencyCode, localeCode, balance, bets, setAccountDetails, setBalance }) => {
  const handleLogout = async () => {
    await fetch('/api/logout');
    cookies.remove('username');
    cookies.remove('sessionKey');
    cookies.remove('accessToken');
    window.location.href = `${window.location.origin}`;
  };

  const getAccountDetails = async () => {
    const result = await fetchData('/api/get-account-details');
    if (result) {
      setAccountDetails({
        name: result.firstName,
        countryCode: result.countryCode,
        currencyCode: result.currencyCode,
        localeCode: result.localeCode,
      });
    }
  };

  const getAccountBalance = async () => {
    const result = await fetchData('/api/get-account-balance');

    if (result) {
      setBalance(result.availableToBetBalance);
    }
  };

  useEffect(() => {
    getAccountDetails();
    getAccountBalance();
  }, []);

  useEffect(() => {
    getAccountBalance();
  }, [bets]);

  return (
    <div id="sidebar-header">
      <p id="flag-name">
        {name}
        <button type="button" id="logout" onClick={handleLogout}>
          <img alt="Logout" src={`${window.location.origin}/icons/logout.png`} />
        </button>
      </p>
      <p>
        <FlagIcon code={countryCode || 'gb'} /> {formatCurrency(localeCode, currencyCode, balance)}
      </p>
      <Clock />
    </div>
  );
};

const mapStateToProps = (state) => ({
  name: state.account.name,
  countryCode: state.account.countryCode,
  currencyCode: state.account.currencyCode,
  localeCode: state.account.localeCode,
  balance: state.account.balance,
  bets: state.order.bets,
});

const mapDispatchToProps = { setAccountDetails, setBalance };

export default connect(mapStateToProps, mapDispatchToProps)(Account);
