import React, { Component } from "react";

export class Redirect extends Component {
  constructor( props ) {
    super(props);
  }
  componentWillMount(){
    window.location = "http://identitysso.betfair.com/view/vendor-login?client_id=72532&response_type=code&redirect_uri=code"
  }
  render(){
    return (<section>Redirecting...</section>);
  }
}

export default Redirect;