import React from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import { ListItemIcon } from '@material-ui/core';
//* Actions
import { loadMyMarkets } from '../../../actions/sport';

const MarketSaveButton = ({ sport: { id, name, type, children }, submenuList, myMarkets, loadMyMarkets }) => {
  const marketItemSaved = myMarkets.findIndex((item) => item.id === id && item.type == type && item.name == name) !== -1;

  const updateMyMarkets = (e) => {
    e.stopPropagation();

    const storedMarkets = JSON.parse(localStorage.getItem('myMarkets')) || {};

    console.log(!marketItemSaved);

    if (marketItemSaved) {
      delete storedMarkets[id];
    } else {
      storedMarkets[id] = {};
      storedMarkets[id][type] = { id, type };
      console.log(storedMarkets);

      if (submenuList) {
        console.log(Object.keys(submenuList));
        Object.keys(submenuList).forEach((type) => {
          storedMarkets[id][type] = {
            id: submenuList[type].id, 
            type,
          }
        });
      }
    }
    console.log(storedMarkets);
    localStorage.setItem('myMarkets', JSON.stringify(storedMarkets));

    // console.log({ id, name, type, children }, submenuList);

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
