import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions/account";
import FlagIcon from "./FlagIcon";
import Clock from "./Clock";

const Account = props => {
  useEffect(() => {
    fetch(`/api/get-account-details`)
      .then(res => res.json())
      .then(details => props.onReceiveAccountDetails(details));

    fetch(`/api/get-account-balance`)
      .then(res => res.json())
      .then(account => props.onReceiveBalance(account.balance));
  }, []);

  if (!props.loggedIn) {
    return <Redirect to="/logout" />;
  } else {
    return (
      <div id="sidebar-header">
        <p id="flag-name" paragraph>
          {props.name}
          <button id="logout" onClick={e => props.onLogout(false)}>
            <img
              alt={"Logout"}
              src={window.location.origin + "/icons/logout.png"}
            />
          </button>
        </p>
        <p paragraph>
          <FlagIcon code={props.countryCode || "gb"} />{" "}
          {new Intl.NumberFormat(
            props.localeCode
              ? `${props.localeCode}-${props.localeCode.toUpperCase()}`
              : "gb-GB",
            {
              style: "currency",
              currency: props.currencyCode || "GBP"
            }
          ).format(props.balance)}
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
    time: state.account.time,
    loggedIn: state.account.loggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: loggedIn => dispatch(actions.setLoggedIn(loggedIn)),
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
