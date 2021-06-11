import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import { ListItemIcon } from '@material-ui/core';
//* Actions
import { addNewMarket, removeMarket } from '../../../redux/actions/sport';

const MarketSaveButton = ({ id, sportId, name, nodes, myMarkets, addNewMarket, removeMarket }) => {
  const marketItemSaved = !_.isEmpty(myMarkets[id]);

  const updateMyMarkets = (e) => {
    e.stopPropagation();

    if (marketItemSaved) removeMarket(id);
    else addNewMarket({ id, sportId, name, nodes });
  };

  return (
    <ListItemIcon style={{ minWidth: 'auto', cursor: 'pointer' }} onClick={updateMyMarkets}>
      <img
        src={window.location.origin + (marketItemSaved ? '/icons/Minus_Button.png' : '/icons/Plus_ButtonGreen.svg')}
        alt="Add"
        style={{
          height: '16px',
          width: 'auto',
          alignSelf: 'center',
        }}
      />
    </ListItemIcon>
  );
};

const mapStateToProps = (state) => ({
  myMarkets: state.sports.myMarkets,
});

const mapDispatchToProps = {
  addNewMarket,
  removeMarket,
};

export default connect(mapStateToProps, mapDispatchToProps)(MarketSaveButton);
