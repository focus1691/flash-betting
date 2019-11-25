import React from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from '@material-ui/core/Divider';
import CountryCodeConverter from '../../../utils/CountryCodeConverter'
export default ({ list, itemSelector, clickHandler, myMarkets, idSelector, currentSportId, updateMyMarkets }) => {
    return (   
        list.map((item, index) => {
            const marketItemSaved = myMarkets.find(market => market.id == item[idSelector] && market.sportId == currentSportId) !== undefined
                return (
                    <tr style={{display: 'flex', flexDirection: 'row', height: "3em", paddingBottom: "2px", marginTop: '0.5em', marginLeft: '2rem'}}>
                        <ListItemIcon style={{minWidth: 'auto', cursor: 'pointer'}} onClick={() => updateMyMarkets(marketItemSaved, item[idSelector], item[itemSelector], currentSportId)}>
                            <img
                                src={window.location.origin + (marketItemSaved ? "/icons/rounded-remove-button.png" : "/icons/add-button-inside-black-circle.png")}
                                alt={"Add"}
                                style = {{height: '16px', width: 'auto', alignSelf: 'center', 
                                          filter: marketItemSaved ? 'invert(22%) sepia(92%) saturate(6689%) hue-rotate(358deg) brightness(91%) contrast(121%)' : 'none'}}
                            />
                        </ListItemIcon>
                        <ListItem button style={{ }} onClick={(e) => clickHandler(item)}>
                            
                            <p style={{minWidth: `13em`}}>{CountryCodeConverter(item[itemSelector])}</p>

                        </ListItem>
                        {/* If last one don't make divider */}
                        {index === list.length - 1 ? null : <Divider style={{ marginLeft: '4rem', width: "100%" }} />}
                    </tr>
                )
            }
        )
    )
};