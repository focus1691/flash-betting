import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';

const Logout = props => {

    const [loggedIn, setLoggedIn] = useState(true);

    useEffect(() => {
        fetch('/api/logout')
        .then(res => res.json())
        .then(logout => {
            console.log(logout);
            localStorage.removeItem("sessionKey");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("expiresIn");
            setLoggedIn(false);
        });

    });

    return (
        <>
        { loggedIn === false ? <Redirect to='/login' /> : null }
        <section>Logging out...</section>
        </>
      );
}

export default connect()(Logout);