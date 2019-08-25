import React, { useEffect } from 'react';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import * as actions from '../../actions/account';
import useInterval from 'react-useinterval';
import FlagIcon from './FlagIcon';
import Clock from './Clock';

const Account = props => {

	useEffect(() => {
		fetch(`/api/get-account-details`)
		.then(res => res.json())
		.then(details => props.onReceiveAccountDetails(details));

		fetch(`/api/get-account-balance`)
		.then(res => res.json())
		.then(account => props.onReceiveBalance(account.balance));
	});

	return (
		<>
		{props.loggedIn ? null : <Redirect to='/logout' /> }
		<div id="sidebar-header">
			<p id="flag-name" paragraph>{props.name}
			<button id="logout" onClick={e =>	props.onLogout(false)}><img alt={"Logout"} src={window.location.origin + '/icons/logout.png'}/></button>
			</p>
			<p paragraph><FlagIcon code={props.countryCode} size={'1x'} /> £{props.balance}</p>
			<Clock/>
		</div>
		</>
	);
}

const mapStateToProps = state => {
    return {
			name: state.account.name,
			countryCode: state.account.countryCode,
			balance: state.account.balance,
			time: state.account.time,
			loggedIn: state.account.loggedIn
	};
}

const mapDispatchToProps = dispatch => {
	return {
		onLogout: loggedIn => dispatch(actions.setLogout(loggedIn)),
		onReceiveAccountDetails: details => dispatch(actions.setAccountDetails(details)),
		onReceiveBalance: balance => dispatch(actions.setBalance(balance)),
		onUpdateTime: time => dispatch(actions.setTime(time))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);