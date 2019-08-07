import React, {Component} from 'react';

class BettingPanel extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="betting-panel">
				<div className="cancelled-bets">
				</div>

				<div className="bet-buttons">

				</div>

				<div className="filled-bets">

				</div>
			</div>
		);
	}
}

export default BettingPanel;