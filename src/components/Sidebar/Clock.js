import React, {useState} from 'react';
import useInterval from 'react-useinterval';

const Clock = () => {
    const ONE_SECOND = 1000;
    const [time, setTime] = useState(new Date().toLocaleString());

	useInterval(() => {
		setTime(new Date().toLocaleString());
    }, ONE_SECOND);
    
	return (
        <p id="date-time"><img src={window.location.origin + '/icons/calendar-with-alarm-clock.png'} alt={"Time"} />{time}</p>
	);
}

export default Clock;