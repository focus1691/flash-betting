import React from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import { ListItemIcon } from '@material-ui/core';
//* Actions
import { loadMyMarkets } from '../../../actions/market';

const MarketSaveButton = ({ sport, myMarkets, loadMyMarkets }) => {
  const marketItemSaved = myMarkets.findIndex((item) => item.id === sport.id && item.type == sport.type && item.name == sport.name) !== -1;

  const updateMyMarkets = (marketItemSaved, id, name, type, children) => () => {
    /*
      marketItemSaved - whether it is saved or not
      id - id for the selection
      name - name displayed on myMarkets
      data - the data that the sport contains for the mymarkets so we don't have to go searching for it
    */
    const marketSelection = {
      id, name, type, children,
    };

    fetch(`/api/${!marketItemSaved ? 'save-market' : 'remove-market'}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(marketSelection),
    })
      .then((res) => res.json())
      .then((res) => {
        loadMyMarkets(res);
      })
      .catch(() => {});
  };

  return (
    <ListItemIcon style={{ minWidth: 'auto', cursor: 'pointer' }} onClick={updateMyMarkets(marketItemSaved, sport.id, sport.name, sport.type, sport.children)}>
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
  myMarkets: state.market.myMarkets,
});

const mapDispatchToProps = {
  loadMyMarkets,
};

export default connect(mapStateToProps, mapDispatchToProps)(MarketSaveButton);
