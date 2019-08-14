import React, {Component} from 'react';

export default class MarketInfo extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<table>
				<tbody>
					<tr>Market Information</tr>
					{this.renderContenderInfo()}
				</tbody>
			</table>
		);
	}
	renderContenderInfo() {
		return (
			
			<tr>5. Night secret</tr>
			<tr>Selection</tr>
			<tr>20525252</tr>
			<tr>Silk</tr>
			<tr>Grey</tr>
			<tr>Trainer Name</tr>
			<tr>William Haggas</tr>
			<tr>Age & Weight</tr>
			<tr>3 years / 126 pounds</tr>
			<tr>Form</tr>
			<tr>382-</tr>
			<tr>Days since last run</tr>
			<tr>43</tr>
		);
	}
}