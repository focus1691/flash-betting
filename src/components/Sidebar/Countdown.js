import React, {useState} from 'react';
import { connect } from 'react-redux';
import useInterval from 'react-useinterval';

const Countdown = props => {
    const ONE_SECOND = 1000;
    const [timeRemaining, setTimeRemaining] = useState('--');

	useInterval(() => {
        setTimeRemaining(props.market ? (new Date (props.market.marketStartTime) - new Date() ) : '--');
    }, ONE_SECOND);

    const padZeroes = num => {
        var str = num.toString();

        while (str.length < 2) {
            str = '0'.concat(str);
        }
        return str;
    }

    const msToHMS = ms => {
        if (typeof ms !== 'number') return '--';

        // 1- Convert to seconds:
        var seconds = ms / 1000;
        // 2- Extract hours:
        var hours = Math.floor(parseInt( seconds / 3600 )); // 3,600 seconds in 1 hour
        seconds = seconds % 3600; // seconds remaining after extracting hours
        // 3- Extract minutes:
        var minutes = Math.floor(parseInt( seconds / 60 )); // 60 seconds in 1 minute
        // 4- Keep only seconds not extracted to minutes:
        seconds = Math.floor(seconds % 60);

        return `${hours}:${padZeroes(minutes)}:${padZeroes(seconds)}`;
    };
    return props.marketOpen ? <span>{msToHMS (timeRemaining)}</span> : <span>Sports Trader Pro</span>
}

const mapStateToProps = state => {
	return {
        marketOpen: state.market.marketOpen,
		market: state.market.currentMarket
	}
}

export default connect(mapStateToProps)(Countdown);
