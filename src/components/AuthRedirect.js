import React, {useEffect} from "react";

export default () => {
  useEffect(() => {
    window.location = "http://identitysso.betfair.com/view/vendor-login?client_id=74333&response_type=code&redirect_uri=validation"
  });
  return (<section>Redirecting...</section>);
};