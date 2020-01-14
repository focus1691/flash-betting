import List from "@material-ui/core/List";
import React, { useEffect } from "react";
import { useCookies } from 'react-cookie';
import { connect } from "react-redux";
import { loadMyMarkets } from "../../../actions/market";
import * as actions from "../../../actions/sport";
import { sortSports } from "../../../utils/Algorithms/SortSports";
import DeselectSport from "./DeselectSport";
import SelectSport from "./SelectSport";
import SelectSubmenu from "./SelectSubmenu";

const AllSports = props => {

  const [cookies] = useCookies(['sessionKey', 'username']);

  useEffect(() => {
    // gets all the sports and saves them on the server
    fetch('/api/fetch-all-sports', {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",

      },
      method: "POST",
      body: JSON.stringify({
        sessionKey: decodeURIComponent(cookies.sessionKey)
      })
    });

  }, []);

  useEffect(() => {
    fetch(`/api/get-all-sports`)
      .then(res => res.json())
      .then(sports => {
        sports.push({eventType: {id: "TC-7", name: "Horse Racing - Today's Card"}});
        sports.push({eventType: {id: "TC-4339", name: "Greyhound Racing - Today's Card"}});
        sports = sortSports(sports);
        props.onReceiveAllSports(sports);
      });
  }, []);

  const {
    sports,
    submenuList,
    currentSubmenu,
  } = props.sports;

  useEffect(() => {
		if (submenuList.EVENT_TYPE && submenuList.EVENT_TYPE.name.includes("Today's Card")) {
      props.onUpdateSubmenuCurrent('')
      props.onUpdateSubmenuList({})
		}
  }, [props.winMarketsOnly, props.horseRaces])

  const getSportInfo = (name, newSubmenuType, submenuList, selectedId, apiToCall) => async e => {

    const isHorseRace = (name.startsWith("TC") && name.endsWith("7")) || (name.includes("Horse") && name.includes("Today's Card"));

    // gets the country names and makes it an array ex... [GB]
    const countryNames = Object.keys(props.horseRaces).reduce((acc, item) => {
      if (props.horseRaces[item] === true) {
        return [item, ...acc]
      } else {
        return acc
      }
    }, [])

    // call the api with the id and get new selections
    const data = await fetch(`/api/${apiToCall}/?id=${selectedId}&marketTypes=${props.winMarketsOnly === true ? "WIN" : undefined}&country=${isHorseRace ? JSON.stringify(countryNames) : undefined}`)
                            .then(res => res.json()).catch(err => {});
    
    // set the old submenu as the newSubmenuType: children we received from the api
    if (data) {
      const newSubmenuList = Object.assign({}, submenuList);
      
      newSubmenuList[newSubmenuType] = {name, data};

      props.onUpdateSubmenuCurrent(newSubmenuType);
      props.onUpdateSubmenuList(newSubmenuList);
    }
  }

  const setSubmenu = (data, name, newSubmenuType, submenuList) => {
    const newSubmenuList = Object.assign({}, submenuList);
    newSubmenuList[newSubmenuType] = {name, data};

    props.onUpdateSubmenuCurrent(newSubmenuType);
    props.onUpdateSubmenuList(newSubmenuList);
  }

  const deselectSubmenu = (newSubmenuType, submenuList) => { 
    if (newSubmenuType === "ROOT") {
			props.onUpdateSubmenuCurrent('');
      props.onUpdateSubmenuList({});
			return;
    }
    
    const submenuEnum = {
      ROOT: 0,
      EVENT_TYPE: 1,
      GROUP: 2,
      GROUP_1: 3,
      EVENT: 4,
      RACE: 5,
      MARKET: 6
    }

    // filter out items that are above the submenu level, we are going upward in the list, so we remove items under that aren't needed
    const newSubmenuList = {}

    const maxSubmenuLevel = submenuEnum[newSubmenuType];
    Object.keys(submenuList).map(key => {
      if (!submenuEnum[key] || submenuEnum[key] <= maxSubmenuLevel) {
        newSubmenuList[key] = submenuList[key]
      }
    })
    
    props.onUpdateSubmenuCurrent(newSubmenuType);
    props.onUpdateSubmenuList(newSubmenuList);
  }

  return (
    <div>
      <table id="all-sports">
        <tbody>
          <List>
            { Object.keys(submenuList).map((type, index) => (
                <DeselectSport
                  key={"all-sports-" + submenuList[type].name}
                  type = {type}
                  data = {submenuList[type]}
                  isLast = {index === Object.keys(submenuList).length - 1}
                  submenuList = {submenuList}
                  deselectSubmenu = {deselectSubmenu}
                />
              ))
            }

            { // Selecting Item
              submenuList['EVENT_TYPE'] === undefined || currentSubmenu === "" ? 
              <SelectSport
                sports = {sports}  
                setSubmenu = {getSportInfo}
              />
              :
              <SelectSubmenu 
                data = {submenuList[currentSubmenu].data}
                setSubmenu = {setSubmenu}
                submenuList = {submenuList}
                winMarketsOnly = {props.winMarketsOnly}
              />
            }
          </List>
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    sports: state.sports,
    currentSport: state.currentSport,
    myMarkets: state.market.myMarkets,
    winMarketsOnly: state.settings.winMarketsOnly,
    horseRaces: state.settings.horseRaces
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onReceiveAllSports: sports => dispatch(actions.setAllSports(sports)),
    onUpdateCurrentSport: sport => dispatch(actions.setCurrentSport(sport)),
    onUpdateMyMarkets: markets => dispatch(loadMyMarkets(markets)),
    onUpdateSubmenuList: submenuList => dispatch(actions.updateSubmenuList(submenuList)),
    onUpdateSubmenuCurrent: submenuCurrent => dispatch(actions.updateCurrentSubmenu(submenuCurrent))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllSports);