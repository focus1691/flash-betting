import React, { useEffect } from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import List from '@material-ui/core/List';
//* Actions
import { setAllSports, updateSubmenuList, clearSubmenuList, updateCurrentSubmenu } from '../../../actions/sport';
import { sortSports } from '../../../utils/Algorithms/SortSports';
import DeselectSport from './DeselectSport';
import SelectSport from './SelectSport';
import SelectSubmenu from './SelectSubmenu';
//* JSS
import useStyles from '../../../jss/components/Sidebar/menu/menuStyle';
//* HTTP
import fetchData from '../../../http/fetchData';

const submenuEnum = {
  ROOT: 0,
  EVENT_TYPE: 1,
  GROUP: 2,
  GROUP_1: 3,
  EVENT: 4,
  RACE: 5,
  MARKET: 6,
};

const AllSports = ({ sports, submenuList, currentSubmenu, winMarketsOnly, horseRaces, setAllSports, updateCurrentSubmenu, updateSubmenuList }) => {
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      // gets all the sports and saves them on the server
      fetch('/api/fetch-all-sports');

      let sportsList = await fetchData('/api/get-all-sports');
      if (sportsList) {
        sportsList.push({ eventType: { id: 'TC-7', name: "Horse Racing - Today's Card" } });
        sportsList.push({ eventType: { id: 'TC-4339', name: "Greyhound Racing - Today's Card" } });
        sportsList = sortSports(sportsList);
        setAllSports(sportsList);
      }
    })();
  }, []);

  useEffect(() => {
    if (submenuList.EVENT_TYPE && submenuList.EVENT_TYPE.name.includes("Today's Card")) {
      clearSubmenuList();
    }
  }, [winMarketsOnly, horseRaces]);

  const getSportInfo = (id, name, type, sportId, apiEndpoint) => async () => {
    const isHorseRace = (name.startsWith('TC') && name.endsWith('7')) || (name.includes('Horse') && name.includes("Today's Card"));

    // gets the country names and makes it an array ex... [GB]
    const countryCodes = Object.keys(horseRaces).reduce((acc, item) => {
      if (horseRaces[item] === true) {
        return [item, ...acc];
      }
      return acc;
    }, []);

    // call the api with the id and get new selections
    const data = await fetchData(`/api/${apiEndpoint}/?id=${sportId}&marketTypes=${winMarketsOnly === true ? 'WIN' : undefined}&country=${isHorseRace ? JSON.stringify(countryCodes) : undefined}`);

    // set the old submenu as the type: children we received from the api
    if (data) {
      const newSubmenuList = {};
      newSubmenuList[type] = { id, name, data };

      updateCurrentSubmenu(type);
      updateSubmenuList(newSubmenuList);
    }
  };

  const setSubmenu = (data, name, type, submenuList, id) => {
    const newSubmenuList = { ...submenuList };
    newSubmenuList[type] = { id, name, data };

    updateCurrentSubmenu(type);
    updateSubmenuList(newSubmenuList);
  };

  const deselectSubmenu = (type, submenuList) => {
    if (type === 'ROOT') {
      clearSubmenuList();
      return;
    }

    // filter out items that are above the submenu level, we are going upward in the list, so we remove items under that aren't needed
    const newSubmenuList = {};

    const maxSubmenuLevel = submenuEnum[type];
    Object.keys(submenuList).forEach((key) => {
      if (!submenuEnum[key] || submenuEnum[key] <= maxSubmenuLevel) {
        newSubmenuList[key] = submenuList[key];
      }
    });

    updateCurrentSubmenu(type);
    updateSubmenuList(newSubmenuList);
  };

  return (
    <List className={classes.allSports}>
      {Object.keys(submenuList).map((type, index) => (
        <DeselectSport key={`all-sports-deselect-${submenuList[type].name}`} type={type} data={submenuList[type]} index={index} submenuList={submenuList} deselectSubmenu={deselectSubmenu} />
      ))}

      {!submenuList.EVENT_TYPE || !currentSubmenu ? <SelectSport sports={sports} setSubmenu={getSportInfo} /> : <SelectSubmenu data={submenuList[currentSubmenu].data} setSubmenu={setSubmenu} submenuList={submenuList} />}
    </List>
  );
};

const mapStateToProps = (state) => ({
  sports: state.sports.sports,
  submenuList: state.sports.submenuList,
  currentSubmenu: state.sports.currentSubmenu,
  myMarkets: state.sports.myMarkets,
  winMarketsOnly: state.settings.winMarketsOnly,
  horseRaces: state.settings.horseRaces,
});

const mapDispatchToProps = {
  setAllSports,
  updateSubmenuList,
  clearSubmenuList,
  updateCurrentSubmenu,
};

export default connect(mapStateToProps, mapDispatchToProps)(AllSports);
