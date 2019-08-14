import React, {Component} from 'react';

class CancelledBets extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.getTableData()
		}
	}
	render() {
		return (
			<div>
				<table className={"cancelled-bets"}>
					<tbody>
						{this.renderTableData()}
						{this.renderPrice()}
					</tbody>
				</table>
			</div>
		);
	}
}