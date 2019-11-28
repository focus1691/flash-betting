import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SportsFilterList from "./SportsFilterList";
import CountryCodeConverter from '../../../utils/CountryCodeConverter'

/*
    currentItem - Item at the shown
    newArray - The List of Items we can pick from
    currentItemName - the name of the currentItem
    newArrayName - The name of the List of items
    listSelector - what we use to select from objects : obj[listSelector]
    reverseClickHandler - function for what happens on the click of the currentItem
    clickHandler - function for what happens on item in list click,
    currentItemFull - full item for comparison in reverse click handler
    idSelector - what we use to try and get the Id from the list
*/

export default ({
  currentItem,
  newArray,
  currentItemName,
  newArrayName,
  listSelector,
  reverseClickHandler,
  clickHandler,
  currentItemFull,
  myMarkets,
  idSelector,
  currentSportId,
  updateMyMarkets,
  previousItem
}) => {
  if (currentItemFull === undefined) {
    currentItemFull = currentItem;
  }
  
  return (
    <tr>
        {previousItem !== currentItem ? 
        <React.Fragment>
          <ListItem
            button
          >
            <ListItemText>{CountryCodeConverter(currentItem)}</ListItemText>
          </ListItem>
        </React.Fragment>
        : null} 
        <SportsFilterList
          list={newArray}
          itemSelector={listSelector}
          clickHandler={data => clickHandler(data)}
          myMarkets={myMarkets}
          idSelector={idSelector}
          currentSportId={currentSportId}
          updateMyMarkets={updateMyMarkets}
        />
    </tr>
  );
};
