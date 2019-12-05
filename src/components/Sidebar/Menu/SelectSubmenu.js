import React from 'react'
import { ListItem, ListItemText, Divider } from "@material-ui/core";
import MarketSaveButton from './MarketSaveButton'

export default ({data, setSubmenu, submenuList, winMarketsOnly}) => {
    // const filteredData = winMarketsOnly ? data.filter(sport => (sport.type === "MARKET" && sport.marketType === "WIN") || sport.type !== "MARKET") : data
    const dataWithoutRaces = data.filter(sport => sport.type !== "RACE")

    return dataWithoutRaces.map(sport => (
        <React.Fragment>
            <tr style={{display: 'flex', flexDirection: 'row', height: "3em", paddingBottom: "2px", marginTop: '0.5em', marginLeft: '2rem'}}>
                <MarketSaveButton sport = {sport} />
                <ListItem
                    button
                    onClick={() => { 
                        if (sport.type === "MARKET") 
                            window.open(`/dashboard?marketId=${sport.id}`)
                        else setSubmenu(sport.children, sport.name, sport.type, submenuList, sport.id)
                    }}
                >
                    
                    <ListItemText>{sport.name}</ListItemText>
                </ListItem>
               
            </tr>
            <Divider />
        </React.Fragment>
    ))
}
