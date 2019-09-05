import React from 'react';
import { connect } from 'react-redux';

const Grid = props => {

	const getTableData = () => {
		return {back1: 1.98, back1Matched: 252, back2: 1.99, back2Matched: 100,
			back3: 2, back3Matched: 10, back4: 2.02, back4Matched: 50,
			backAll: 2.04, backAllMatched: 743, layAll: 2.06, layAllMatched: 424,
			lay1: 2.08, lay1Matched: 242, lay2: 2.1, lay2Matched: 10,
			lay3: 2.12, lay3Matched: 250, lay4: 2.14, lay4Matched: 525};
	};

	const renderTableHeader = () => {
		const { currentEvent } = props;
		const date = new Date(currentEvent.openDate);

		return (
			<tr id="grid-header">
				<th colSpan="11">
					<span>Turn One click on</span>
					<img src={window.location.origin + '/icons/video-player.png'} alt={"Video"}/>
					<h1>{currentEvent.openDate !== 0 ? 
						date.toLocaleTimeString() + " " + currentEvent.name
						: "No Event Selected"}</h1>
					<span>Going in-play</span>
					<img src={window.location.origin + '/icons/checked.png'} alt={"Matched"}/>
					<span>Matched: {props.market ? `£${props.market.totalMatched}` : null}</span>
				</th>
			</tr>
		);
	};

	const renderTableSubheader = () => {
		return (
			<tr id="grid-subheader">
				<th>
					<span>Market Cashout</span>
				</th>
				<th colSpan="1">
				</th>

				<th colSpan="1">
				</th>
				<th></th>
				<th><span>Back</span></th>
				<th><span>Lay</span></th>
				<th></th>
				<th></th>
				<th></th>
				<th></th>
				<th></th>
			</tr>
		);
	};

	const renderTableData = () => {
		console.log(`${props.market}\nRUNNERS:`);

		const {back1, back2, back3, back4, backAll, layAll, lay1,
			lay2, lay3, lay4, back1Matched, back2Matched, back3Matched,
			back4Matched, backAllMatched, layAllMatched, lay1Matched,
			lay2Matched, lay3Matched, lay4Matched} = getTableData();

		return props.market.runners.map((runner, index) => {
			console.log(runner);

			return (
				<tr key={runner.selectionId}>
					<td className="grid-contender-detail-cell">
						<img src={window.location.origin + '/images/00077962.jpg'} alt={"Chart"}/>
						<span>{runner.runnerName}</span>
						<span>2.04</span>
						<span>0.80</span>
						<span>235,232</span>
					</td>
					<td className="grid-cell"><span>{back1}</span><span>{back1Matched}</span></td>
					<td className="grid-cell"><span>{back2}</span><span>{back2Matched}</span></td>
					<td className="grid-cell"><span>{back3}</span><span>{back3Matched}</span></td>
					<td className="grid-cell"><span>{back4}</span><span>{back4Matched}</span></td>
					<td className="grid-cell"><span>{backAll}</span><span>{backAllMatched}</span></td>
					<td className="grid-cell"><span>{layAll}</span><span>{layAllMatched}</span></td>
					<td className="grid-cell"><span>{lay1}</span><span>{lay1Matched}</span></td>
					<td className="grid-cell"><span>{lay2}</span><span>{lay2Matched}</span></td>
					<td className="grid-cell"><span>{lay3}</span><span>{lay3Matched}</span></td>
					<td className="grid-cell"><span>{lay4}</span><span>{lay4Matched}</span></td>
				</tr>
			);
		});
	};

	return (
		<div id="grid-container">
			<table className={"grid-view"}>
				<tbody>
					{renderTableHeader()}
					{renderTableSubheader()}
					{props.market ? renderTableData() : null}
				</tbody>
			</table>
		</div>
	);
}

const mapStateToProps = state => {
	return {
		currentEvent: state.sports.currentSport.currentEvent,
		market: state.sports.currentMarket
	}
}

Grid.defaultProps = 
{
	currentEvent: {
		openDate: 0
	}
}

export default connect(mapStateToProps)(Grid);
