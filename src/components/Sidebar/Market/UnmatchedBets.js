import React from 'react';

const UnmatchedBets = ({event, selection, bet}) => {
	return (
		<div>
			<table id="menu-unmatched-bets">
				<tbody>
					<React.Fragment>
						<tr id = "menu-unmatched-heading">
							<button style = {{height: "22px", width: "auto", backgroundColor: 'transparent', visibility: "collapse", pointerEvents: "none"}} />
							<td>Odds</td>
							<td>Stake</td>
							<td>P/L</td>
						</tr>
						<tr id = "menu-unmatched-event">
							<td>TBP Bellewstown</td>
						</tr>
						<tr id = "menu-unmatched-selection">
							<td>Shantou Bay</td>
						</tr>
						<tr id = "menu-unmatched-bet" style={{backgroundColor: bet.isBack ? "#A6D8FF" : "#FAC9D7"}}>
							
							<button style = {{height: "22px", width: "auto"}}>
								{/* <img src = {require('./CancelIcon.svg')} alt="" style = {{height: "100%", width: "auto"}} /> In Progress */}
							</button>
							
							<td>{bet.odds}</td>
							<td>{bet.stake}</td>
							<td id = "pl-style" style = {{color: bet.PL === "0.00" ? "black" : bet.PL > 0 ? "green" : "red"}}>{bet.PL}</td>
							
						</tr>
					</React.Fragment>

				</tbody>
			</table>
		</div>
	);
}

UnmatchedBets.defaultProps = {
	event: "None",
	selection: "None",
	bet: {
		odds: 0.0,
		stake: 0.00,
		PL: "0.00",
		isBack: true
	}
}

export default UnmatchedBets;