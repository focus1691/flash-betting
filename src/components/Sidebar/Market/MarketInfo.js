import React from 'react';
import { connect } from 'react-redux';

const MarketInfo = props => {
	return (
		<table id = "menu-market-info">
			{/* <tbody>
				{props.marketOpen && props.market.eventType && props.market.eventType.id === "7" ?
					<React.Fragment>
						<tr id = "menu-selected-name">
							<td>{props.selection.runnerName}</td>
						</tr>


						<tr>
							<td>{}</td>
						</tr>
						<tr>
							<td>{}</td>
						</tr>

						</React.Fragment>
					: null}
			</tbody> */}
		</table>
	);
}

const mapStateToProps = state => {
	return {
		market: state.market.currentMarket,
		marketOpen: state.market.marketOpen,
		selection: state.market.runnerSelection,
		runners: state.market.runners
	}
}

export default connect(mapStateToProps)(MarketInfo);