import { Divider, ListItem, ListItemText } from "@material-ui/core";
import React from 'react';

export default ({type, data, isLast, submenuList, deselectSubmenu}) => {
    
    return (
        <React.Fragment>
            <ListItem
                button
                onClick={deselectSubmenu(type, submenuList)}
                style={{background: "#f2ececc9"}}
            >
                <ListItemText style={{zIndex: 500, color: isLast ? 'black' : "#999797"}}>
                    {data.name}
                </ListItemText>
            </ListItem>
            <Divider />
        </React.Fragment>
    )
}