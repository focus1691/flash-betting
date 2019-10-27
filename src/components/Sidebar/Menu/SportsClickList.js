import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SportsFilterList from "./SportsFilterList";

/*
    currentItem - Item at the shown
    newArray - The List of Items we can pick from
    currentItemName - the name of the currentItem
    newArrayName - The name of the List of items
    listSelector - what we use to select from objects : obj[listSelector]
    reverseClickHandler - function for what happens on the click of the currentItem
    clickHandler - function for what happens on item in list click,
    currentItemFull - full item for comparison in reverse click handler
*/

export default ({
  currentItem,
  newArray,
  currentItemName,
  newArrayName,
  listSelector,
  reverseClickHandler,
  clickHandler,
  currentItemFull
}) => {
  if (currentItemFull === undefined) {
    currentItemFull = currentItem;
  }

  return (
    <div>
      <React.Fragment>
        <ListItem
          button
          onClick={e =>
            reverseClickHandler(currentItemFull, currentItemName, newArrayName)
          }
        >
          <ListItemText>{currentItem}</ListItemText>
        </ListItem>
      </React.Fragment>
      <tr style={{display: 'flex', flexDirection: 'row', marginLeft: '2rem', height: "3em", paddingBottom: "2px" }}>
        <SportsFilterList
          list={newArray}
          itemSelector={listSelector}
          clickHandler={data => clickHandler(data)}
        />
      </tr>
    </div>
  );
};
