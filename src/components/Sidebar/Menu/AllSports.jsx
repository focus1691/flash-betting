import _ from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import List from '@material-ui/core/List';
//* Actions
import { setAllSports, updateSubmenuList } from '../../../actions/sport';
import { sortSports } from '../../../utils/Algorithms/SortSports';
import DeselectSubmenu from './DeselectSubmenu';
import SelectSport from './SelectSport';
import SelectSubmenu from './SelectSubmenu';
//* JSS
import useStyles from '../../../jss/components/Sidebar/menu/menuStyle';
//* HTTP
import fetchData from '../../../http/fetchData';

const AllSports = ({ sports, submenuList, winMarketsOnly, horseRaces, setAllSports, updateSubmenuList }) => {
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
    if (!_.isEmpty(submenuList) && submenuList.name.includes("Today's Card")) {
      updateSubmenuList({});
    }
  }, [winMarketsOnly, horseRaces]);

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
        updateSubmenuList({ sportId, name, data, nodes: [] });
      }
    } else {
      const data = await fetchData(`/api/fetch-sport-data?id=${sportId}`);
      if (data) {
        updateSubmenuList({ sportId, name, data, nodes: [] });
      }
    }
  };

  const setSubmenu = (id, name) => {
    const newSubmenuList = { ...submenuList };
    newSubmenuList.nodes.push({ id, name });
    updateSubmenuList(newSubmenuList);
  };

  const deselectSubmenu = (index, isFirst) => {
    //* Remove the current data selection if the first node is deselected
    if (isFirst) {
      updateSubmenuList({});
      return;
    }

    const newSubmenuList = { ...submenuList };
    newSubmenuList.nodes.splice(index, newSubmenuList.nodes.length);
    updateSubmenuList(newSubmenuList);
  };

  return (
    <List className={classes.allSports}>
      {_.isEmpty(submenuList.data) ? (
        <SelectSport sports={sports} setSubmenu={getSportInfo} />
      ) : (
        <>
          <DeselectSubmenu key={`all-sports-deselect-${submenuList.sportId}`} name={submenuList.name} isFirst index={0} isLast={false} deselectSubmenu={deselectSubmenu} />
          {submenuList.nodes.map(({ id, name }, index) => (
            <DeselectSubmenu key={`all-sports-deselect-${id}`} name={name} index={index} isLast={index === submenuList.nodes.length - 1} deselectSubmenu={deselectSubmenu} />
          ))}
          <SelectSubmenu setSubmenu={setSubmenu} submenuList={submenuList} />
        </>
      )}
    </List>
  );
};

const mapStateToProps = (state) => ({
  sports: state.sports.sports,
  submenuList: state.sports.submenuList,
  myMarkets: state.sports.myMarkets,
  winMarketsOnly: state.settings.winMarketsOnly,
  horseRaces: state.settings.horseRaces,
});

const mapDispatchToProps = {
  setAllSports,
  updateSubmenuList,
};

export default connect(mapStateToProps, mapDispatchToProps)(AllSports);
