import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import SocketContext from '../../SocketContext';
import * as actions from '../../actions/auth';
import useInterval from 'react-useinterval';

const Account = props => {
	// const [time, setTime] = useState(new Date().toLocaleString());
	const ONE_SECOND = 1000;
	const ONE_MINUTE = 5000;

	// console.log(props);

	// props.socket.emit("get_account_balance", {sesssionKey: localStorage.getItem("sessionKey")});

	useEffect(() => {
		if (!props.balance) props.socket.emit("get_account_balance");
		if (!props.name) props.socket.emit("get_account_details");

		// if (!props.name) props.socket.emit("get_account_details", {sesssionKey: localStorage.getItem("sessionKey")});

		props.socket.on('account_balance', data => {
			console.log('balance received', data);
			props.onReceiveBalance(data.balance);
		});
		props.socket.on('account_details', data => {
			console.log('details received', data.details);
			props.onReceiveAccountDetails(data.details);
		});
	});

	useInterval(() => {
		// setTime(new Date().toLocaleString());
		// props.time = new Date().toLocaleString();
		console.log(props.name, props.balance);
	}, ONE_SECOND);

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
		name: state.name,
		balance: state.balance
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onReceiveAccountDetails: name => dispatch(actions.setName(name)),
		onReceiveBalance: balance => dispatch(actions.setBalance(balance))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountWithSocket);