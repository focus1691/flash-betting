import React from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from '@material-ui/core/Divider';

export default ({ list, itemSelector, clickHandler }) => {
    console.log(list)
    return (   
        list.map((item, index) =>
            <tr style={{display: 'flex', flexDirection: 'row', height: "3em", paddingBottom: "2px", marginTop: '0.5em', marginLeft: '2rem'}}>
                <ListItemIcon style={{minWidth: 'auto', cursor: 'pointer'}} onClick={() => {}}>
                    <img
                        src={window.location.origin + "/icons/add-button-inside-black-circle.png"}
                        alt={"Add"}
                        style = {{height: '16px', width: 'auto', alignSelf: 'center'}}
                    />
                </ListItemIcon>
                <ListItem button style={{ }} onClick={(e) => clickHandler(item)}>
                    
                    <p style={{minWidth: `250px`}}>{item[itemSelector]}</p>

                </ListItem>
                {/* If last one don't make divider */}
                {index === list.length - 1 ? null : <Divider style={{ marginLeft: '4rem', width: "100%" }} />}
            </tr>
        )
    )
};