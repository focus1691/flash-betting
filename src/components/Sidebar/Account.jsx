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

const cookies = new Cookies();

const Account = ({ name, countryCode, currencyCode, localeCode, balance, bets, setAccountDetails, setBalance }) => {
  const classes = useStyles();
  const handleLogout = async () => {
    await fetch('/api/logout');
    cookies.remove('username');
    cookies.remove('sessionKey');
    cookies.remove('accessToken');
    window.location.href = `${window.location.origin}`;
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
      <p className={classes.flag}>
        {name}
        <button type="button" className={classes.logoutButton} onClick={handleLogout}>
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
