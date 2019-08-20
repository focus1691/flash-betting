import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import SocketContext from '../../SocketContext';
import * as actions from '../../actions/account';
import useInterval from 'react-useinterval';

const Account = props => {
	const ONE_SECOND = 1000;
	const ONE_MINUTE = 5000;

	useEffect(() => {

		if (!props.name) props.socket.emit("get_account_details");
		if (!props.balance) props.socket.emit("get_account_balance");

		props.socket.on('account_details', data => {
			props.onReceiveAccountDetails(data.details);
		});

		props.socket.on('account_balance', data => {
			props.onReceiveBalance(data.balance);
		});
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

const AccountWithSocket = props => (
	<SocketContext.Consumer>
		{socket => <Account {...props} socket={socket} />}
	</SocketContext.Consumer>
);

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

export default connect(mapStateToProps, mapDispatchToProps)(AccountWithSocket);