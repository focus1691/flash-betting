import _ from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import List from '@material-ui/core/List';
//* Actions
import { updateMyMarketsSubmenu } from '../../../actions/sport';
import DeselectSubmenu from './DeselectSubmenu';
import SelectMyMarkets from './SelectMyMarkets';
import SelectSubmenu from './SelectSubmenu';
//* JSS
import useStyles from '../../../jss/components/Sidebar/menu/menuStyle';
//* HTTP
import fetchData from '../../../http/fetchData';

const MyMarkets = ({ myMarketsSubmenu, updateMyMarketsSubmenu, winMarketsOnly, horseRaces }) => {
  const classes = useStyles();

  const getSportInfo = async (id, name, sportId, nodes) => {
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
        updateMyMarketsSubmenu({ sportId, name, data, nodes: [] });
      }
    }
    // fetch the sport data
    else if (_.isEmpty(nodes)) {
      const data = await fetchData(`/api/fetch-sport-data?id=${sportId}`);
      if (data) {
        updateMyMarketsSubmenu({ sportId, name, data, nodes: _.isEmpty(nodes) ? [] : nodes });
      }
    } else {
      const data = await fetchData(`/api/fetch-sport-data?id=${sportId}`);
      if (data) {
        updateMyMarketsSubmenu({ sportId, name, data, nodes });
      }
    }
  };

  useEffect(() => {
    if (myMarketsSubmenu.EVENT_TYPE && myMarketsSubmenu.EVENT_TYPE.name.includes("Today's Card")) {
      const id = myMarketsSubmenu.EVENT_TYPE.name.includes('Horse') ? 7 : 4339;
      getSportInfo(myMarketsSubmenu.EVENT_TYPE.name, 'EVENT_TYPE', myMarketsSubmenu, id, 'list-todays-card');
    }
  }, [winMarketsOnly]);

  const setSubmenu = (id, name, sportId, nodes) => async () => {
    if (_.isEmpty(myMarketsSubmenu)) {
      //
    } else {
      //
    }

    if (id.startsWith('TC-')) {
      getSportInfo(name, type, submenuList, id.match(/\d+/)[0], 'list-todays-card');
    } else if (type === 'EVENT_TYPE') {
      getSportInfo(name, type, submenuList, id, 'fetch-sport-data');
    } else {
      const newSubmenuList = { ...submenuList };
      newSubmenuList[type] = { name, data };

      updateMyMarketsSubmenu(newSubmenuList);
    }
  };

  const deselectSubmenu = (newSubmenuType, submenuList) => {
    if (newSubmenuType === 'ROOT') {
      updateMyMarketsSubmenu({});
      return;
    }

    // filter out items that are above the submenu level, we are going upward in the list, so we remove items under that aren't needed
    const newSubmenuList = {};
    updateMyMarketsSubmenu(newSubmenuList);
  };

  return (
    <List className={classes.allSports}>
      {Object.keys(myMarketsSubmenu).map((type, index) => (
        <DeselectSubmenu
          key={`my-markets-deselect-${myMarketsSubmenu[type].name}`}
          type={type}
          data={myMarketsSubmenu[type]}
          isLast={index === Object.keys(myMarketsSubmenu).length - 1}
          submenuList={myMarketsSubmenu}
          deselectSubmenu={deselectSubmenu}
        />
      ))}

      {_.isEmpty(myMarketsSubmenu.data) ? <SelectMyMarkets setSubmenu={setSubmenu} /> : <SelectSubmenu setSubmenu={setSubmenu} submenuList={myMarketsSubmenu} />}
    </List>
  );
};

const mapStateToProps = (state) => ({
  myMarketsSubmenu: state.sports.myMarketsSubmenu,
  winMarketsOnly: state.settings.winMarketsOnly,
  horseRaces: state.settings.horseRaces,
});

const mapDispatchToProps = { updateMyMarketsSubmenu };

export default connect(mapStateToProps, mapDispatchToProps)(MyMarkets);
