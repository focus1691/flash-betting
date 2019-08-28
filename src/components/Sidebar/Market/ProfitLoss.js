import React from 'react';

const ProfitLoss = () => {
	return (
		<div>
			<table id="menu-profit-loss">
				<tbody>
					{renderProfitAndLoss()}
				</tbody>
			</table>
		</div>
	);
};

const renderProfitAndLoss = () => {
	return (
		<React.Fragment>
			<tr>
				<td>Selection</td>
				<td>Win</td>
				<td>Lose</td>
			</tr>
			<tr>
				<td>Night Secret</td>
				<td>0.80</td>
				<td>0.80</td>			
			</tr>
			<tr>
				<td>Night Secret</td>
				<td>0.80</td>
				<td>0.80</td>			
			</tr>
			<tr>
				<td>Night Secret</td>
				<td>0.80</td>
				<td>0.80</td>			
			</tr>
			<tr>
				<td>Night Secret</td>
				<td>0.80</td>
				<td>0.80</td>			
			</tr>
			<tr>
				<td>Night Secret</td>
				<td>0.80</td>
				<td>0.80</td>			
			</tr>
		</React.Fragment>
	);
};

export default ProfitLoss;