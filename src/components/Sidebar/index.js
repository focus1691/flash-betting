import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Account from "./Account";
import Toolbar from "./Toolbar";
import Event from "./Event";
import ToggleMenu from "./ToggleMenu";

const Sidebar = () => {
    return (
        <Drawer
            className="sidebar"
            variant="permanent"
            classes={{
                paper: "sidebar"
            }}
            anchor="left">
        <div className={"sticky"}>
            <Account/>
            <Toolbar/>
            <Event/>
        </div>
        <ToggleMenu/>
        </Drawer>
    );
};

export default Sidebar;