import React from 'react'
import { ListItem, ListItemText, Divider } from "@material-ui/core";
import MarketSaveButton from './MarketSaveButton';


export default ({sports, setSubmenu}) => {
    
    return sports.map(sport => (
        <React.Fragment>
            <tr style={{display: 'flex', flexDirection: 'row', height: "3em", paddingBottom: "2px", marginTop: '0.5em', marginLeft: '1rem'}}>
                <MarketSaveButton sport = {{id: sport.eventType.id, name: sport.eventType.name, type: "EVENT_TYPE", data: {}}} />
                <ListItem
                    button
                    onClick={() => setSubmenu(
                                    sport.eventType.name, 
                                    'EVENT_TYPE', 
                                    {}, 
                                    sport.eventType.id.match(/\d+/)[0], 
                                    sport.eventType.id.startsWith("TC-") ? 'list-todays-card' : 'fetch-sport-data')}
                    >
                    <ListItemText>{sport.eventType.name}</ListItemText>
                </ListItem>
            </tr>
            <Divider />
        </React.Fragment>
    ))
}