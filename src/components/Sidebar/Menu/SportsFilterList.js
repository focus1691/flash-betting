import React from "react";
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';

export default ({ list, itemSelector, clickHandler }) => (
    list.map((item, index) =>
        <React.Fragment>
            <ListItem button style={{ marginLeft: '4rem', paddingTop: "2px", paddingBottom: "2px" }} onClick={(e) => clickHandler(item)}>
                <p>{item[itemSelector]}</p>

            </ListItem>
            {/* If last one don't make divider */}
            {index === list.length - 1 ? null : <Divider style={{ marginLeft: '4rem', width: "100%" }} />}
        </React.Fragment>
    )
);