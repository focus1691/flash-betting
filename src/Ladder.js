import React from 'react';

const Ladder = () => {
	var objects = {};
	return (
		<table className="tg">
			<tbody>
				<LadderHeader/>
				<LadderHeader/>
				<LadderRow/>
				<LadderRow/>
				<LadderRow/>
			</tbody>
		</table>
	);
};

const LadderHeader = () => {
	return (
		<tr>
			<th className="tg-0pky ladder-header"></th>
			<th className="tg-0pky ladder-header"></th>
			<th className="tg-0pky ladder-header"></th>
			<th className="tg-0pky ladder-header"></th>
			<th className="tg-0pky ladder-header"></th>
		</tr>
	);
};

const LadderRow = () => {
	return (
		<tr>
			<th className="tg-0pky"></th>
			<th className="tg-0pky"></th>
			<th className="tg-0pky"></th>
			<th className="tg-0pky"></th>
			<th className="tg-0pky"></th>
		</tr>
	);
};

export default Ladder;