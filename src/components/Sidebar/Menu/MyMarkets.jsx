import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import List from '@material-ui/core/List';
//* Actions
import { updateSubmenuListMyMarkets, updateSubmenuMyMarkets, loadMyMarkets } from '../../../actions/sport';
import DeselectSport from './DeselectSport';
import SelectSubmenu from './SelectSubmenu';
//* JSS
import useStyles from '../../../jss/components/Sidebar/menu/menuStyle';
//* HTTP
import fetchData from '../../../http/fetchData';

const submenuEnum = {
  ROOT: 0,
  EVENT_TYPE: 1,
  GROUP: 2,
  EVENT: 3,
  RACE: 4,
  MARKET: 5,
};

const MyMarkets = ({ myMarkets, winMarketsOnly, horseRaces, currentSubmenuMyMarkets, submenuListMyMarkets, loadMyMarkets, updateSubmenuMyMarkets, updateSubmenuListMyMarkets }) => {
  const classes = useStyles();

  const getSportInfo = useCallback(
    async (name, newSubmenuType, submenuList, selectedId, apiToCall) => {
      const isHorseRace = (name.startsWith('TC') && name.endsWith('7')) || (name.includes('Horse') && name.includes("Today's Card"));

      // gets the country names and makes it an array ex... [GB]
      const countryCodes = Object.keys(horseRaces).reduce((acc, item) => {
        if (horseRaces[item] === true) {
          return [item, ...acc];
        }
        return acc;
      }, []);

      // call the api with the id and get new selections
      const data = await fetchData(`/api/${apiToCall}/?id=${selectedId}&marketTypes=${winMarketsOnly === true ? 'WIN' : undefined}&country=${isHorseRace ? JSON.stringify(countryCodes) : undefined}`);

      // set the old submenu as the newSubmenuType: children we received from the api
      if (data) {
        const newSubmenuList = { ...submenuList };
        newSubmenuList[newSubmenuType] = { name, data };

        updateSubmenuListMyMarkets(newSubmenuList, {});
        updateSubmenuMyMarkets(newSubmenuType);
      }
    },
    [horseRaces, updateSubmenuListMyMarkets, updateSubmenuMyMarkets, winMarketsOnly],
  );

  useEffect(() => {

    fetch('/api/get-my-markets', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ storedMarkets: localStorage.getItem('myMarkets') || {}}),
    })
      .then((res) => res.json())
      .then((myMarkets) => console.log(myMarkets));

    // fetch(`/api/get-my-markets?storedMarkets=${JSON.stringify(localStorage.getItem('myMarkets') || {})}`)
    //   .then((res) => res.json())
    //   .then((myMarkets) => console.log(myMarkets));
      // .then((markets) => loadMyMarkets(markets));
  });

  useEffect(() => {
    if (submenuListMyMarkets.EVENT_TYPE && submenuListMyMarkets.EVENT_TYPE.name.includes("Today's Card")) {
      const id = submenuListMyMarkets.EVENT_TYPE.name.includes('Horse') ? 7 : 4339;
      getSportInfo(submenuListMyMarkets.EVENT_TYPE.name, 'EVENT_TYPE', submenuListMyMarkets, id, 'list-todays-card');
    }
  }, [winMarketsOnly]);

  const setSubmenu = (data, name, type, submenuList, id) => {
    if (id.startsWith('TC-')) {
      getSportInfo(name, type, submenuList, id.match(/\d+/)[0], 'list-todays-card');
    } else if (type === 'EVENT_TYPE') {
      getSportInfo(name, type, submenuList, id, 'fetch-sport-data');
    } else {
      const newSubmenuList = { ...submenuList };
      newSubmenuList[type] = { name, data };

      updateSubmenuListMyMarkets(newSubmenuList);
      updateSubmenuMyMarkets(type);
    }
  };

  const deselectSubmenu = (newSubmenuType, submenuList) => {
    if (newSubmenuType === 'ROOT') {
      updateSubmenuMyMarkets('');
      updateSubmenuListMyMarkets({});
      return;
    }

    // filter out items that are above the submenu level, we are going upward in the list, so we remove items under that aren't needed
    const newSubmenuList = {};

    const maxSubmenuLevel = submenuEnum[newSubmenuType];
    Object.keys(submenuList).map((key) => {
      if (!submenuEnum[key] || submenuEnum[key] <= maxSubmenuLevel) {
        newSubmenuList[key] = submenuList[key];
      }
    });

    updateSubmenuMyMarkets(newSubmenuType);
    updateSubmenuListMyMarkets(newSubmenuList);
  };

  return (
    <List className={classes.allSports}>
      {/* { Deselecting Items } */}
      {Object.keys(submenuListMyMarkets).map((type, index) => (
        <DeselectSport
          key={`my-markets-deselect-${submenuListMyMarkets[type].name}`}
          type={type}
          data={submenuListMyMarkets[type]}
          isLast={index === Object.keys(submenuListMyMarkets).length - 1}
          submenuList={submenuListMyMarkets}
          deselectSubmenu={deselectSubmenu}
        />
      ))}

      {
        // Selecting Item
        <SelectSubmenu
          data={currentSubmenuMyMarkets ? submenuListMyMarkets[currentSubmenuMyMarkets].data : myMarkets}
          setSubmenu={setSubmenu}
          submenuList={submenuListMyMarkets}
        />
      }
    </List>
  );
};

const mapStateToProps = (state) => ({
  myMarkets: state.sports.myMarkets,
  winMarketsOnly: state.settings.winMarketsOnly,
  horseRaces: state.settings.horseRaces,
  currentSubmenuMyMarkets: state.sports.currentSubmenuMyMarkets,
  submenuListMyMarkets: state.sports.submenuListMyMarkets,
});

const mapDispatchToProps = {
  loadMyMarkets,
  updateSubmenuMyMarkets,
  updateSubmenuListMyMarkets,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyMarkets);
