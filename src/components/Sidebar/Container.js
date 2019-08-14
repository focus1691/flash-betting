import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Account from "./Account";
import Toolbar from "./Toolbar";
import Event from "./Event";
import ToggleMenu from "./ToggleMenu";

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