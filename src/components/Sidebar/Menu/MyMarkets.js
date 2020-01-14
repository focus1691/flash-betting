import List from "@material-ui/core/List";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions/market";
import {
  updateSubmenuListMyMarkets,
  updateSubmenuMyMarkets
} from "../../../actions/sport";
import DeselectSport from "./DeselectSport";
import SelectSubmenu from "./SelectSubmenu";

const MyMarkets = props => {
  const submenuList = props.submenuListMyMarkets;
  const setSubmenuList = props.onUpdateSubmenuListMyMarkets;
  const currentSubmenu = props.currentSubmenuMyMarkets;
  const setCurrentSubmenu = props.onUpdateSubmenuMyMarkets;

  useEffect(() => {
    fetch("/api/get-my-markets")
      .then(res => res.json())
      .then(markets => props.onReceiveMyMarkets(markets));
  }, []);

  useEffect(() => {
    if (
      props.submenuListMyMarkets.EVENT_TYPE &&
      props.submenuListMyMarkets.EVENT_TYPE.name.includes("Today's Card")
    ) {
      const id = props.submenuListMyMarkets.EVENT_TYPE.name.includes("Horse")
        ? 7
        : 4339;
      getSportInfo(
        props.submenuListMyMarkets.EVENT_TYPE.name,
        "EVENT_TYPE",
        submenuList,
        id,
        `list-todays-card`
      );
    }
  }, [props.winMarketsOnly]);

  const getSportInfo = async (
    name,
    newSubmenuType,
    submenuList,
    selectedId,
    apiToCall
  ) => {
    const isHorseRace =
      (name.startsWith("TC") && name.endsWith("7")) ||
      (name.includes("Horse") && name.includes("Today's Card"));

    // gets the country names and makes it an array ex... [GB]
    const countryNames = Object.keys(props.horseRaces).reduce((acc, item) => {
      if (props.horseRaces[item] === true) {
        return [item, ...acc];
      } else {
        return acc;
      }
    }, []);

    // call the api with the id and get new selections
    const data = await fetch(`/api/${apiToCall}/?id=${selectedId}
								&marketTypes=${props.winMarketsOnly === true ? "WIN" : undefined}
								&country=${isHorseRace ? JSON.stringify(countryNames) : undefined}`)
      .then(res => res.json())
      .catch(err => false);

    // set the old submenu as the newSubmenuType: children we received from the api
    if (data) {
      const newSubmenuList = Object.assign({}, submenuList);
      newSubmenuList[newSubmenuType] = { name, data };

      setSubmenuList(newSubmenuList, {});
      setCurrentSubmenu(newSubmenuType);
    }
  };

  const setSubmenu = (data, name, newSubmenuType, submenuList, id) => {
    if (id.startsWith("TC-")) {
      getSportInfo(
        name,
        newSubmenuType,
        submenuList,
        id.match(/\d+/)[0],
        `list-todays-card`
      );
    } else if (newSubmenuType === "EVENT_TYPE") {
      getSportInfo(name, newSubmenuType, submenuList, id, `fetch-sport-data`);
    } else {
      const newSubmenuList = Object.assign({}, submenuList);
      newSubmenuList[newSubmenuType] = { name, data };

      setSubmenuList(newSubmenuList);
      setCurrentSubmenu(newSubmenuType);
    }
  };

  const deselectSubmenu = (newSubmenuType, submenuList) => {
    if (newSubmenuType === "ROOT") {
      setCurrentSubmenu("");
      setSubmenuList({});
      return;
    }

    const submenuEnum = {
      ROOT: 0,
      EVENT_TYPE: 1,
      GROUP: 2,
      EVENT: 3,
      RACE: 4,
      MARKET: 5
    };

    // filter out items that are above the submenu level, we are going upward in the list, so we remove items under that aren't needed
    const newSubmenuList = {};

    const maxSubmenuLevel = submenuEnum[newSubmenuType];
    Object.keys(submenuList).map(key => {
      if (!submenuEnum[key] || submenuEnum[key] <= maxSubmenuLevel) {
        newSubmenuList[key] = submenuList[key];
      }
    });

    setCurrentSubmenu(newSubmenuType);
    setSubmenuList(newSubmenuList);
  };

  return (
    <div>
      <table id="all-sports">
        <tbody>
          <List>
            {/* { Deselecting Items } */}
            {Object.keys(submenuList).map((type, index) => (
              <DeselectSport
                type={type}
                data={submenuList[type]}
                isLast={index === Object.keys(submenuList).length - 1}
                submenuList={submenuList}
                deselectSubmenu={deselectSubmenu}
              />
            ))}

            {
              // Selecting Item
              <SelectSubmenu
                data={
                  currentSubmenu === ""
                    ? props.myMarkets
                    : submenuList[currentSubmenu].data
                }
                setSubmenu={setSubmenu}
                submenuList={submenuList}
                winMarketsOnly={props.winMarketsOnly}
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
    myMarkets: state.market.myMarkets,
    sports: state.sports,
    winMarketsOnly: state.settings.winMarketsOnly,
    horseRaces: state.settings.horseRaces,
    currentSubmenuMyMarkets: state.sports.currentSubmenuMyMarkets,
    submenuListMyMarkets: state.sports.submenuListMyMarkets
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onReceiveMyMarkets: markets => dispatch(actions.loadMyMarkets(markets)),
    onUpdateSubmenuMyMarkets: submenuCurrent =>
      dispatch(updateSubmenuMyMarkets(submenuCurrent)),
    onUpdateSubmenuListMyMarkets: submenu =>
      dispatch(updateSubmenuListMyMarkets(submenu))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyMarkets);
