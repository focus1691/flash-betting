import React, { useState } from "react";
import { OauthSender } from 'react-oauth-flow';
import "./LoginTextButton.css"

export default ({onClick}) => {
    return (
        <OauthSender
            authorizeUrl="https://identitysso.betfair.com/view/vendor-login"
            clientId={632912}

            render={({ url }) => 
                <form action={url}>
                    <button class="submitLoginButton" onClick>Login</button>
                </form>
            }
        />
        
    );
}
    

