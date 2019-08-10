import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import Account from "./Account.jsx";
import Toolbar from "./Toolbar.jsx";
import Event from "./Event.jsx";
import ToggleMenu from "./ToggleMenu.jsx";

const drawerWidth = "15%";

const useStyles = makeStyles(theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    }
}));

const PermanentDrawerLeft = () => {
    const classes = useStyles();
    return (
        <Drawer
            className="sidebar"
            variant="permanent"
            classes={{
                paper: "sidebar"
            }}
            anchor="left">
        <Account></Account>
        <Toolbar></Toolbar>
        <Event></Event>
        <ToggleMenu></ToggleMenu>
        </Drawer>
    );
};

export default PermanentDrawerLeft;