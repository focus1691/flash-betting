import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions/account";
import FlagIcon from "./FlagIcon";
import Clock from "./Clock";
import { formatCurrency } from "./../../utils/NumberFormat";
import { useCookies } from "react-cookie";

const Account = props => {
  const [loggedIn, setLoggedIn] = useState(true);
  const [cookies, removeCookie] = useCookies(['sessionKey', 'username', 'accessToken', 'refreshToken', 'expiresIn']);
  const [error, setError] = useState("");

  const handleLogout = () => e => {
    setLoggedIn(false);
  };

  useEffect(() => {
    fetch(`/api/get-account-details`)
      .then(res => res.json())
      .then(details => {
        if (details.error) {
          setError(details.error)
          setLoggedIn(false); 
        }
        props.onReceiveAccountDetails(details)
        return details;
      })

    fetch(`/api/get-account-balance`)
      .then(res => res.json())
      .then(account => {
        if (account.error) {
          setError(account.error)
          setLoggedIn(false); 
        }
        props.onReceiveBalance(account.balance)
      })
  }, []);

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
          {props.name}
          <button id="logout" onClick={handleLogout()}>
            <img
              alt={"Logout"}
              src={window.location.origin + "/icons/logout.png"}
            />
          </button>
        </p>
        <p>
          <FlagIcon code={props.countryCode || "gb"} />{" "}
          {formatCurrency(props.localeCode, props.currencyCode, props.balance)}
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
    time: state.account.time
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onReceiveAccountDetails: details =>
      dispatch(actions.setAccountDetails(details)),
    onReceiveBalance: balance => dispatch(actions.setBalance(balance)),
    onUpdateTime: time => dispatch(actions.setTime(time))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account);