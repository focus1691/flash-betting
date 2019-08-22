import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/account';
import useInterval from 'react-useinterval';

const Account = props => {
	const ONE_SECOND = 1000;

	useEffect(() => {
		fetch(`/api/get-account-details`)
		.then(res => res.json())
		.then(details => props.onReceiveAccountDetails(details.name));

		fetch(`/api/get-account-balance`)
		.then(res => res.json())
		.then(account => props.onReceiveBalance(account.balance));
	});

	// useInterval(() => {
	// 	props.onUpdateTime(new Date().toLocaleString());
	// }, ONE_SECOND);

	return (
		<div id="sidebar-header">
			<p paragraph>{props.name}</p>
			<p paragraph>£{props.balance}</p>
			<span id="date-time"><img src={window.location.origin + '/icons/calendar-with-a-clock-time-tools.png'} alt={"Time"} />{props.time}</span>
		</div>
	);
}

const mapStateToProps = state => {
    return {
		name: state.account.name,
		balance: state.account.balance,
		time: state.account.time
	};
}

const mapDispatchToProps = dispatch => {
	return {
		onReceiveAccountDetails: name => dispatch(actions.setName(name)),
		onReceiveBalance: balance => dispatch(actions.setBalance(balance)),
		onUpdateTime: time => dispatch(actions.setTime(time))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Account);