import React, {Component} from 'react';

class Ladder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.getTableData()
		}
	}
	render() {
		return (
			<div>
				<table className={"ladder"}>
					<tbody>
						{this.renderTableData()}
						{this.renderPrice()}
					</tbody>
				</table>
			</div>
		);
	}
	getTableData() {
		var data = [];

		for (var i = 0; i < 25; i++) {
			data.push({betAmount: null, layCount: 22, odds: 1.82, backCount: 44, emptyCell: null})
		}
		return data;
	}
	renderTableData() {
		return this.state.data.map((priceAtOdds, index) => {
			const {betAmount, layCount, odds, backCount, emptyCell} = priceAtOdds;
			return (
				<tr>
					<td>{betAmount}</td>
					<td>{layCount}</td>
					<td>{odds}</td>
					<td>{backCount}</td>
					<td>{emptyCell}</td>
				</tr>
			)
		});
	}
	renderPrice() {
		return (
			<tr className="price-row">
				<td>10</td>
				<td>20</td>
				<td>25</td>
				<td>50</td>
				<td>100</td>
			</tr>
		);
	}
}

export default Ladder;