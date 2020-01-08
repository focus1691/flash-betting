import React, { useEffect } from "react";
import { useCookies } from 'react-cookie';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as actions from "../actions/account";

const Logout = props => {
  const [removeCookie] = useCookies(['sessionKey', 'accessToken', 'refreshToken', 'expiresIn']);
  useEffect(() => {
    fetch("/api/logout")
      .then(res => res.json())
      .then(logout => {
        removeCookie('sessionKey');
        removeCookie('accessToken');
        removeCookie('refreshToken');
        removeCookie('expiresIn');

        props.onLogout(false);
      });
  }, []);

  return (
    <>
      {props.loggedIn ? null : <Redirect to="/" />}
      <section>Logging out...</section>
    </>
  );
};

const mapStateToProps = state => {
  return {
    loggedIn: state.account.loggedIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: loggedIn => dispatch(actions.setLoggedIn(loggedIn))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout);
