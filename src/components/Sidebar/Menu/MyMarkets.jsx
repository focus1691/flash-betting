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

  const setSubmenu = async (id, name, sportId, nodes) => {
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
    else if (_.isEmpty(myMarketsSubmenu.data)) {
      const data = await fetchData(`/api/fetch-sport-data?id=${sportId}`);
      if (data) {
        updateMyMarketsSubmenu({ sportId, name, data, nodes: _.isEmpty(nodes) ? [] : nodes });
      }
    } else {
      const newSubmenuList = { ...myMarketsSubmenu };
      newSubmenuList.nodes.push({ id, name });
      updateMyMarketsSubmenu(newSubmenuList);
    }
  };

  const deselectSubmenu = (index, isFirst) => {
    //* Remove the current data selection if the first node is deselected
    if (isFirst) {
      updateMyMarketsSubmenu({});
      return;
    }

    const newSubmenuList = { ...myMarketsSubmenu };
    newSubmenuList.nodes.splice(index, newSubmenuList.nodes.length);
    updateMyMarketsSubmenu(newSubmenuList);
  };

  useEffect(() => {
    if (myMarketsSubmenu.EVENT_TYPE && myMarketsSubmenu.EVENT_TYPE.name.includes("Today's Card")) {
      const id = myMarketsSubmenu.EVENT_TYPE.name.includes('Horse') ? 7 : 4339;
      setSubmenu(myMarketsSubmenu.EVENT_TYPE.name, 'EVENT_TYPE', myMarketsSubmenu, id, 'list-todays-card');
    }
  }, [winMarketsOnly]);

  return (
    <List className={classes.allSports}>
      {_.isEmpty(myMarketsSubmenu.data) ? (
        <SelectMyMarkets setSubmenu={setSubmenu} />
      ) : (
        <>
          <DeselectSubmenu key={`all-sports-deselect-${myMarketsSubmenu.sportId}`} name={myMarketsSubmenu.name} isFirst index={0} isLast={false} deselectSubmenu={deselectSubmenu} />
          {myMarketsSubmenu.nodes.map(({ id, name }, index) => (
            <DeselectSubmenu key={`all-sports-deselect-${id}`} name={name} index={index} isLast={index === myMarketsSubmenu.nodes.length - 1} deselectSubmenu={deselectSubmenu} />
          ))}
          <SelectSubmenu setSubmenu={setSubmenu} submenuList={myMarketsSubmenu} />
        </>
      )}
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
