import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions/account";

const Logout = props => {
  useEffect(() => {
    fetch("/api/logout")
      .then(res => res.json())
      .then(logout => {
        localStorage.removeItem("sessionKey");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("expiresIn");
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
