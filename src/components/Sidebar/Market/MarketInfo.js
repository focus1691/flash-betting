import React from 'react';

const MarketInfo = ({selection, info}) => {
	if (selection == "None") {
		return null;
	}
	
	return (
		<table id = "menu-market-info">
			<tbody>
				<React.Fragment>
						<tr id = "menu-selected-name">
							<td>{selection}</td>
						</tr>
						{
							info.map(data => (
								<>
									<tr>
										<td>{data.heading}</td>
									</tr>
									<tr>
										<td>{data.data}</td>
									</tr>
								</>
							))
						}
				</React.Fragment>
			</tbody>
		</table>
	);
}

MarketInfo.defaultProps = {
	selection: "None",
	info: [
		{ 
			heading: "Selection",
			data: "None"
		}
	]
}

export default MarketInfo;