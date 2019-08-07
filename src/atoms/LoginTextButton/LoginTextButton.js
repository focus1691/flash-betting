import React, { useState } from "react";
import "./LoginTextButton.css"

export default ({onClick}) => {
    return (
          <a
            href={`http://identitysso.betfair.com/view/vendor-login?client_id=72532&response_type=code&redirect_uri=`}
          >
            Login
          </a>
    );
}
    

