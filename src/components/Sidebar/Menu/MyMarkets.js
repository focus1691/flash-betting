import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions/market";
import List from "@material-ui/core/List";
import getCountryName from "../../../utils/CountryCodeConverter";
import SelectSubmenu from "./SelectSubmenu";
import DeselectSport from "./DeselectSport";

const MyMarkets = props => {

	const [submenuList, setSubmenuList] = useState({})
	const [currentSubmenu, setCurrentSubmenu] = useState("");

	useEffect(() => {
		fetch('/api/get-my-markets')
			.then(res => res.json())
			.then(markets => props.onReceiveMyMarkets(markets));
	}, []);


	const getSportInfo = async (name, newSubmenuType, submenuList, selectedId, apiToCall) => {
		// call the api with the id and get new selections
		const data = await fetch(`/api/${apiToCall}/?id=${selectedId}
								&marketTypes=${props.winMarketsOnly === true ? "WIN" : undefined}
								&country=${name.startsWith("TC") && name.endsWith("7") ? getCountryName(props.horseRaces) : undefined}`)
							.then(res => res.json()).catch(err => false);
	
		
		// set the old submenu as the newSubmenuType: children we received from the api
		if (data) {
		  const newSubmenuList = Object.assign({}, submenuList);
		  newSubmenuList[newSubmenuType] = {name, data};
	
		  setSubmenuList(newSubmenuList);
		  setCurrentSubmenu(newSubmenuType);
		}
		
	}

	const setSubmenu = (data, name, newSubmenuType, submenuList, id) => {
		if (id.startsWith("TC-")) {
			getSportInfo(name, newSubmenuType, submenuList, id.match(/\d+/)[0], `list-todays-card`);
		}
		else if (newSubmenuType === "EVENT_TYPE") {
			getSportInfo(name, newSubmenuType, submenuList, id, `fetch-sport-data`);
		} else {
			const newSubmenuList = Object.assign({}, submenuList);
			newSubmenuList[newSubmenuType] = {name, data};
			
			setSubmenuList(newSubmenuList);
			setCurrentSubmenu(newSubmenuType);
		}
	}
	
	const deselectSubmenu = (newSubmenuType, submenuList) => { 
		const submenuEnum = {
		  ROOT: 0,
		  EVENT_TYPE: 1,
		  GROUP: 2,
		  EVENT: 3,
		  RACE: 4,
		  MARKET: 5
		}
	
		// filter out items that are above the submenu level, we are going upward in the list, so we remove items under that aren't needed
		const newSubmenuList = {}
	
		const maxSubmenuLevel = submenuEnum[newSubmenuType];
		Object.keys(submenuList).map(key => {
		  if (!submenuEnum[key] || submenuEnum[key] <= maxSubmenuLevel) {
			newSubmenuList[key] = submenuList[key]
		  }
		})
		
		setCurrentSubmenu(newSubmenuType);
		setSubmenuList(newSubmenuList);
	}

	console.log(props.myMarkets)

	return (
		<div>
		  <table id="all-sports">
			<tbody>
			  <List>
				{/* { Deselecting Items } */}
				{ Object.keys(submenuList).map((type, index) => (
					<DeselectSport 
					  type = {type}
					  data = {submenuList[type]}
					  isLast = {index === Object.keys(submenuList).length - 1}
					  submenuList = {submenuList}
					  deselectSubmenu = {deselectSubmenu}
					/>
				  ))
				}
	
				{ // Selecting Item
					<SelectSubmenu 
						data = {currentSubmenu === "" ? props.myMarkets : submenuList[currentSubmenu].data}
						setSubmenu = {setSubmenu}
						submenuList = {submenuList}
						winMarketsOnly = {props.winMarketsOnly}
					/>
				}
			  </List>
			</tbody>
		  </table>
		</div>
	)
}

const mapStateToProps = state => {
	return {
		myMarkets: state.market.myMarkets,
		sports: state.sports,
		winMarketsOnly: state.settings.winMarketsOnly,
		horseRaces: state.settings.horseRaces
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onReceiveMyMarkets: markets => dispatch(actions.loadMyMarkets(markets)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MyMarkets);