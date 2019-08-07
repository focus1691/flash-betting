import React from 'react';
import ContenderDetail from "./ContenderDetails.jsx";
import Ladder from "./Ladder.jsx";
import BettingPanel from "./BettingPanel.jsx";

export default function OddsTable () {
	return (
      	<div className="odds-table">
	        <ContenderDetail className="contender-detail"></ContenderDetail>
	        <Ladder></Ladder>
	        <BettingPanel></BettingPanel>
        </div>
	);
}