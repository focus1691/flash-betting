import React from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import MarketSaveButton from './MarketSaveButton';
//* JSS
import useStyles from '../../../jss/components/Sidebar/menu/selectSportStyle';

const SelectMyMarkets = ({ myMarkets, setSubmenu }) => {
  const classes = useStyles();

  return Object.values(myMarkets).map(({ id, sportId, name, nodes }) => (
    <ListItem key={`select-my-market-${sportId}`}>
      <ListItem button onClick={setSubmenu(id, name, sportId.match(/\d+/)[0], nodes)}>
        <ListItemIcon className={classes.dropdownIcon}>
          <img src={`${window.location.origin}/icons/caret-arrow-up.png`} alt="" />
        </ListItemIcon>
        <ListItemText className={classes.name}>{name}</ListItemText>
        <MarketSaveButton id={id} sportId={sportId} name={name} nodes={nodes} />
      </ListItem>
    </ListItem>
  ));
};

const mapStateToProps = (state) => ({
  myMarkets: state.sports.myMarkets,
});

export default connect(mapStateToProps)(SelectMyMarkets);
