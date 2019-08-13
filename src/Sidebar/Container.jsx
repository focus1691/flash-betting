import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Account from "./Account.jsx";
import Toolbar from "./Toolbar.jsx";
import Event from "./Event.jsx";
import ToggleMenu from "./ToggleMenu.jsx";

const PermanentDrawerLeft = () => {
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