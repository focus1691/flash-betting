import React from 'react';
import { connect } from 'react-redux';
import ContenderDetail from "./ContenderDetails";
import Ladder from "./Ladder";
import BettingPanel from "./BettingPanel";


const Ladders = props => {
	// if (props.currentEvent.openDate === 0) {
		// return <p>No Event Selected</p>
	// }
	return (
      	<div className="odds-table">
	        <ContenderDetail className="contender-detail"></ContenderDetail>
	        <Ladder></Ladder>
			<Ladder></Ladder>
	        <Ladder></Ladder>
			<Ladder></Ladder>
	        <Ladder></Ladder>
			<Ladder></Ladder>
	        <Ladder></Ladder>
			<Ladder></Ladder>
	        <BettingPanel></BettingPanel>
        </div>
	);
}


const mapStateToProps = state => {
	return {
		currentEvent: state.sports.currentSport.currentEvent,
		marketOpen: state.market.marketOpen,
		market: state.market.currentMarket
	}
}

export default connect(mapStateToProps)(Ladders);