import React, {Component} from 'react';
import Icon from './00077962.jpg';
import VideoIcon from '../icons/video-player.png';
import GreenTick from '../icons/checked.png';
import RedCross from '../icons/error.png';

export default class EventTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.getTableData()
		};
	}
	render() {
		return (
			<div id="grid-container">
				<table className={"grid-view"}>
					<tbody>
						{this.renderTableHeader()}
						{this.renderTableSubheader()}
						{this.renderTableData()}
					</tbody>
				</table>
			</div>
		);
	}
	getTableData() {
		var data = [];

		for (var i = 0; i < 7; i++) {
			data.push({back1: 1.98, back1Matched: 252, back2: 1.99, back2Matched: 100,
					   back3: 2, back3Matched: 10, back4: 2.02, back4Matched: 50,
					   backAll: 2.04, backAllMatched: 743, layAll: 2.06, layAllMatched: 424,
					   lay1: 2.08, lay1Matched: 242, lay2: 2.1, lay2Matched: 10,
					   lay3: 2.12, lay3Matched: 250, lay4: 2.14, lay4Matched: 525});
		}
		return data;
	}
	renderTableHeader() {
		return (
			<tr id="grid-header">
				<th colspan="11">
					<span>Turn One click on</span>
					<img src={VideoIcon}/>
					<h1>18:30 6f Class Stks Windsor</h1>
					<span>Going in-play</span>
					<img src={GreenTick}/>
					<span>Matched: 333,834</span>
				</th>
			</tr>
		);
	}
	renderTableSubheader() {
		return (
			<tr id="grid-subheader">
				<th>
					<span>Market Cashout</span>
				</th>
				<th colspan="1">
				</th>

				<th colspan="1">
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
	}
	renderTableData() {
		return this.state.data.map((contender, index) => {
			const {back1, back2, back3, back4, backAll, layAll, lay1,
				lay2, lay3, lay4, back1Matched, back2Matched, back3Matched,
				back4Matched, backAllMatched, layAllMatched, lay1Matched,
				lay2Matched, lay3Matched, lay4Matched} = contender;
			return (
				<tr>
					<td className="grid-contender-detail-cell">
						<img src={Icon}/>
						<span>5. Night Secret</span>
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
			)
		});
	}
}