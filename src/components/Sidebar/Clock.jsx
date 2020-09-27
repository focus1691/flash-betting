import React, {useState} from 'react';
import useInterval from 'react-useinterval';

const Clock = () => {
    const ONE_SECOND = 1000;
    const [time, setTime] = useState(new Date().toLocaleString());

	useInterval(() => {
		setTime(new Date().toLocaleString());
    }, ONE_SECOND);
    
	return (
        <div className={"box"}>
            <img src={window.location.origin + '/icons/calendar-with-alarm-clock.png'} alt={"Time"} />
            <span>{time}</span>
        </div>
	);
}

export default Clock;