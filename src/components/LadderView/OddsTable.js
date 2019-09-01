import React from 'react';
import { connect } from 'react-redux';
import ContenderDetail from "./ContenderDetails";
import Ladder from "./Ladder";
import BettingPanel from "./BettingPanel";


function OddsTable ({currentEvent}) {
	if (currentEvent.openDate === 0) {
		return <p>No Event Selected</p>
	}
	return (
      	<div className="odds-table">
	        <ContenderDetail className="contender-detail"></ContenderDetail>
	        <Ladder></Ladder>
	        <BettingPanel></BettingPanel>
        </div>
	);
}


const mapStateToProps = state => {
	
	return {
		currentEvent: state.sports.currentSport.currentEvent
	}
}

OddsTable.defaultProps = 
{
	currentEvent: {
		openDate: 0,

	}
}

export default connect(mapStateToProps, null)(OddsTable);