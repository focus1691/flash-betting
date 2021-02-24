import React, { useEffect } from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import List from '@material-ui/core/List';
//* Actions
import { updateSubmenuListMyMarkets } from '../../../actions/sport';
import DeselectSport from './DeselectSport';
import SelectSubmenu from './SelectSubmenu';
//* JSS
import useStyles from '../../../jss/components/Sidebar/menu/menuStyle';
//* HTTP
import fetchData from '../../../http/fetchData';

const MyMarkets = ({ myMarkets, winMarketsOnly, horseRaces, submenuListMyMarkets, updateSubmenuListMyMarkets }) => {
  const classes = useStyles();

  const getSportInfo = (id, name, sportId) => async () => {
    if (id.startsWith('TC-')) {
      const isHorseRace = (name.startsWith('TC') && name.endsWith('7')) || (name.includes('Horse') && name.includes("Today's Card"));

      // gets the country names and makes it an array ex... [GB]
      const countryCodes = Object.keys(horseRaces).reduce((acc, item) => {
        if (horseRaces[item] === true) {
          return [item, ...acc];
        }
        return acc;
      }, []);

      // call the api with the id and get new selections
      const data = await fetchData(`/api/list-todays-card?id=${sportId}&marketTypes=${winMarketsOnly === true ? 'WIN' : undefined}&country=${isHorseRace ? JSON.stringify(countryCodes) : undefined}`);

      // set the old submenu as the type: children we received from the api
      if (data) {
        updateSubmenuListMyMarkets({ sportId, name, data, nodes: [] });
      }
    } else {
      const data = await fetchData(`/api/fetch-sport-data?id=${sportId}`);
      if (data) {
        updateSubmenuListMyMarkets({ sportId, name, data, nodes: [] });
      }
    }
  };

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
    }
  };

  const deselectSubmenu = (newSubmenuType, submenuList) => {
    if (newSubmenuType === 'ROOT') {
      updateSubmenuListMyMarkets({});
      return;
    }

    // filter out items that are above the submenu level, we are going upward in the list, so we remove items under that aren't needed
    const newSubmenuList = {};
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
        <SelectSubmenu data={[]} setSubmenu={setSubmenu} submenuList={submenuListMyMarkets} />
      }
    </List>
  );
};

const mapStateToProps = (state) => ({
  myMarkets: state.sports.myMarkets,
  winMarketsOnly: state.settings.winMarketsOnly,
  horseRaces: state.settings.horseRaces,
  submenuListMyMarkets: state.sports.submenuListMyMarkets,
});

const mapDispatchToProps = { updateSubmenuListMyMarkets };

export default connect(mapStateToProps, mapDispatchToProps)(MyMarkets);
