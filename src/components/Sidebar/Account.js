import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setAccountDetails, setBalance } from "../../actions/account";
import FlagIcon from "./FlagIcon";
import Clock from "./Clock";
import { formatCurrency } from "./../../utils/NumberFormat";
import { useCookies } from "react-cookie";

const Account = ({name, countryCode, currencyCode, localeCode, balance, bets, setAccountDetails, setBalance, onUpdateTime}) => {
  const [loggedIn, setLoggedIn] = useState(true);
  const [cookies, removeCookie] = useCookies(['sessionKey', 'username', 'accessToken', 'refreshToken', 'expiresIn']);
  const [error, setError] = useState("");

  const handleLogout = () => e => {
    setLoggedIn(false);
  };

  const getAccountDetails = async () => {
    await fetch(`/api/get-account-details`)
    .then(res => res.json())
    .then(res => { 
      if (res.error) {
        window.location.href = window.location.origin + "/?error=" + (res.error.data ? res.error.data.AccountAPINGException.errorCode : "GENERAL_AUTH_ERROR");
      } else {
        setAccountDetails(res);
      }
    });
  };

  const getAccountBalance = async () => {
    await fetch(`/api/get-account-balance`)
    .then(res => res.json())
    .then(res =>  {
      if (res.error) {
        window.location.href = window.location.origin + "/?error=" + (res.error.data ? res.error.data.AccountAPINGException.errorCode : "GENERAL_AUTH_ERROR");
      } else {
        setBalance(res.balance);
      }
    });
  };

  useEffect(() => {
      getAccountDetails();
      getAccountBalance();
  }, []);

  useEffect(() => {
    getAccountBalance();
  }, [bets]);

  if (!loggedIn) {
    removeCookie('sessionKey');
    removeCookie('accessToken');
    removeCookie('refreshToken');
    removeCookie('expiresIn');
    removeCookie('username');

    window.location.href = window.location.origin + "/?error=" + error;
  } else {
    return (
      <div id="sidebar-header">
        <p id="flag-name">
          {name}
          <button id="logout" onClick={handleLogout()}>
            <img
              alt={"Logout"}
              src={window.location.origin + "/icons/logout.png"}
            />
          </button>
        </p>
        <p>
          <FlagIcon code={countryCode || "gb"} />{" "}
          {formatCurrency(localeCode, currencyCode, balance)}
        </p>
        <Clock />
      </div>
    );
  }
};

const mapStateToProps = state => {
  return {
    name: state.account.name,
    countryCode: state.account.countryCode,
    currencyCode: state.account.currencyCode,
    localeCode: state.account.localeCode,
    balance: state.account.balance,
    bets: state.order.bets
  };
};

const mapDispatchToProps = { setAccountDetails, setBalance };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account);