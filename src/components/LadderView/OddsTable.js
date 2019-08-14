import React from 'react';
import ContenderDetail from "./ContenderDetails";
import Ladder from "./Ladder";
import BettingPanel from "./BettingPanel";

export default function OddsTable () {
	return (
      	<div className="odds-table">
	        <ContenderDetail className="contender-detail"></ContenderDetail>
	        <Ladder></Ladder>
	        <BettingPanel></BettingPanel>
        </div>
	);
}