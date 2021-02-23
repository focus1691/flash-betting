import React from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import { ListItemIcon } from '@material-ui/core';
//* Actions
import { loadMyMarkets } from '../../../actions/sport';

const MarketSaveButton = ({ sport: { id, name, type, children }, myMarkets, loadMyMarkets }) => {
  console.log(myMarkets);
  const marketItemSaved = myMarkets.findIndex((item) => item.id === id && item.type == type && item.name == name) !== -1;

  const updateMyMarkets = (e) => {
    // e.stopPropagation();
    // const marketSelection = { id, name, type, children };

    // fetch(`/api/${!marketItemSaved ? 'save-market' : 'remove-market'}`, {
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   method: 'POST',
    //   body: JSON.stringify(marketSelection),
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     loadMyMarkets(res);
    //   })
    //   .catch(() => {});
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
  loadMyMarkets,
};

export default connect(mapStateToProps, mapDispatchToProps)(MarketSaveButton);
