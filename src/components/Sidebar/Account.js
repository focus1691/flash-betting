import React, {useState} from 'react';
import useInterval from 'react-useinterval';

const Account = () => {
	const [balance, setBalance] = useState(424.24);
	const [time, setTime] = useState(new Date().toLocaleString());
	const ONE_SECOND = 1000;

	useInterval(() => {
		setTime(new Date().toLocaleString());
	}, ONE_SECOND);

	return (
	  <div id="sidebar-header">
	    <p paragraph>Username</p>
	    <p paragraph>£{balance}</p>
	    <span id="date-time"><img src={window.location.origin + '/icons/calendar-with-a-clock-time-tools.png'} alt={"Time"}/>{time}</span>
	  </div>
	);
}

export default Account;