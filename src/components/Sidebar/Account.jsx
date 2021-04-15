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
//* JSS
import useStyles from '../../jss/components/Sidebar/accountStyle';
//* Utils
import { clearCookies, redirectToLogin } from '../../session/cleanup';

const cookies = new Cookies();

const Account = ({ name, countryCode, currencyCode, localeCode, balance, bets, setAccountDetails, setBalance }) => {
  const classes = useStyles();
  const handleLogout = async () => {
    await fetch('/api/logout');
    clearCookies(cookies);
    redirectToLogin();
  };

  useEffect(() => {
    (async () => {
      const AccountDetailsResponse = await fetchData('/api/get-account-details');
      const AccountFundsResponse = await fetchData('/api/get-account-balance');

      if (AccountDetailsResponse) {
        setAccountDetails({
          name: AccountDetailsResponse.firstName,
          countryCode: AccountDetailsResponse.countryCode,
          currencyCode: AccountDetailsResponse.currencyCode,
          localeCode: AccountDetailsResponse.localeCode,
        });
      }
      if (AccountFundsResponse) {
        setBalance(AccountFundsResponse.availableToBetBalance);
      }
    })();
  }, []);

  useEffect(() => {
    const getAccountBalance = async () =>{
      const AccountFundsResponse = await fetchData('/api/get-account-balance');
      if (AccountFundsResponse) {
        setBalance(AccountFundsResponse.availableToBetBalance);
      }
    }
    getAccountBalance();
  }, [bets]);

  return (
    <div className={classes.header}>
      <div className={classes.welcome}>
        <p>{`Hi, ${name}!`}</p>
        <button type="button" className={classes.logoutButton} onClick={handleLogout}>
          <img alt="Logout" src={`${window.location.origin}/icons/SignOut.svg`} />
        </button>
      </div>
      <div className={classes.account}>
        <FlagIcon code={countryCode || 'gb'} />
        <span>Available balance:</span>
        <p>{formatCurrency(localeCode, currencyCode, balance)}</p>
        <Clock />
      </div>
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
