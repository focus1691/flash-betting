import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import SideBarHeader from "./header.jsx";

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

export default function PermanentDrawerLeft() {
  const classes = useStyles();

  return (
    <Drawer
      className="sidebar"
      variant="permanent"
      classes={{
        paper: "sidebar"
      }}
      anchor="left"
    >
      <SideBarHeader></SideBarHeader>
    </Drawer>
  );
}
