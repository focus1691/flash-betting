import React from 'react'
import { ListItem, ListItemText, Divider } from "@material-ui/core";

export default ({type, data, isLast, submenuList, deselectSubmenu}) => {
    
    return (
        <React.Fragment>
            <ListItem
                button
                onClick={() => deselectSubmenu(type, submenuList)}
                style={{background: "#f2ececc9"}}
            >
                <ListItemText style={{zIndex: 500, color: isLast ? 'black' : "orange"}}>
                    {data.name}
                </ListItemText>
            </ListItem>
            <Divider />
        </React.Fragment>
    )
}