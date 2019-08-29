import React from 'react';

const ProfitLoss = ({data}) => {
	if (data.filter(item => item.selection !== "None").length < 1) {
		return null;
	}
	return (
		<div>
			<table id="menu-profit-loss">
				<tbody>
					{renderProfitAndLoss(data)}
				</tbody>
			</table>
		</div>
	);
};

ProfitLoss.defaultProps = {
	data: [
		{
			selection: "None",
			win: "0.00",
			lose: "0.00"
		}
	]
}

const renderProfitAndLoss = (data) => {
	return (
		<React.Fragment>
			<tr id = "menu-selected-name">
				<td>Selection</td>
				<td>Win</td>
				<td>Lose</td>
			</tr>
			{
				data.map(item => 
					<>
					<tr>
						<td>{item.selection}</td>
						<td>{item.win}</td>
						<td>{item.lose}</td>
					</tr>
					</>	
				)
			}
		</React.Fragment>
	);
};

export default ProfitLoss;