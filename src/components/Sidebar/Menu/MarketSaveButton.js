import { ListItemIcon } from '@material-ui/core';
import React from 'react';
import { connect } from "react-redux";
import { loadMyMarkets } from '../../../actions/market';

const MarketSaveButton = ({sport, myMarkets, onUpdateMyMarkets}) => {
    const marketItemSaved = myMarkets.findIndex(item => item.id === sport.id && item.type == sport.type && item.name == sport.name) !== -1
    
    const updateMyMarkets = (marketItemSaved, id, name, type, children) => e => {
        /*
            marketItemSaved - whether it is saved or not
            id - id for the selection
            name - name displayed on myMarkets
            data - the data that the sport contains for the mymarkets so we don't have to go searching for it
        */
        const marketSelection = {id, name, type, children};

        fetch(`/api/${!marketItemSaved ? 'save-market' : 'remove-market'}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify(marketSelection)
        })
        .then(res => res.json())
        .then(res => {
          onUpdateMyMarkets(res)
        })
        .catch(res => {})
    }

    return (
        <ListItemIcon style={{minWidth: 'auto', cursor: 'pointer'}} onClick={updateMyMarkets(marketItemSaved, sport.id, sport.name, sport.type, sport.children)}>
            <img
                src={window.location.origin + (marketItemSaved ? "/icons/rounded-remove-button.png" : "/icons/add-button-inside-black-circle.png")}
                alt={"Add"}
                style = {{height: '16px', width: 'auto', alignSelf: 'center', 
                            filter: marketItemSaved ? 'invert(22%) sepia(92%) saturate(6689%) hue-rotate(358deg) brightness(91%) contrast(121%)' : 'none'}}
            />
        </ListItemIcon>
    )
}

const mapStateToProps = state => {
    return {
        myMarkets: state.market.myMarkets,
    };
  };
  
const mapDispatchToProps = dispatch => {
    return {
        onUpdateMyMarkets: markets => dispatch(loadMyMarkets(markets)),
    };
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MarketSaveButton);