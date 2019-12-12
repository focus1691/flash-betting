import React, { useState } from "react";
import { connect } from 'react-redux';
import Drawer from "@material-ui/core/Drawer";
import { createMuiTheme, withStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import Account from "./Account";
import Toolbar from "./Toolbar";
import Event from "./Event";
import Menu from "./Menu/";
import Market from "./Market/";
import Settings from "./Settings/";

const BootstrapButton = withStyles({
    root: {
      boxShadow: 'none',
      textTransform: 'none',
      fontSize: 16,
      padding: '6px 12px',
      border: '1px solid',
      lineHeight: 1.5,
      color: "#fff",
      backgroundColor: '#232323',
      borderColor: '#fff',
      fontWeight: 'bold',
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        backgroundColor: '#403E3E',
        borderColor: '#0062cc',
      },
      '&:active': {
        boxShadow: 'none',
        backgroundColor: '#33AD33',
        borderColor: '#005cbf',
      },
      '&:focus': {
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
      },
    },
  })(Button);
  
  const theme = createMuiTheme({
    palette: {
      primary: green,
    },
  });

const Sidebar = props => {

    const [openTab, setOpenTab] = useState(2);
    const activeStyle = "#389C41";

    const changeTab = tab => e => {
      setOpenTab(tab);
    };

    const createToggleButton = (name, tab) => {
        return (
          <ThemeProvider theme={theme}>
            <BootstrapButton 
              variant="contained"
              color="primary"
              style={openTab === tab ? { background: activeStyle } : {}}
              onClick={changeTab(tab)}
              className={"toggle-button"}>
              {name}
            </BootstrapButton>
          </ThemeProvider>
        );
      };

      const renderActiveTab = () => {
        switch (openTab) {
          case 1: return <Menu/>;
          case 2: return <Market/>
          case 3: return <Settings/>
          default: return null;
        }
      };

    return (
        <Drawer
            className="sidebar"
            variant="permanent"
            classes={{
                paper: "sidebar"
            }}
            anchor="left">
        <div className={"sticky"} style={{zIndex: "2"}}>
            {props.fullscreen ? null : <Account/>}
            <Toolbar/>
            <Event/>
            <div id="toggle-buttons">
                {createToggleButton("Menu", 1)}
                {createToggleButton("Market", 2)}
                {createToggleButton("Settings", 3)}
             </div>
        </div>
        {renderActiveTab()}
        </Drawer>
    );
};

const mapStateToProps = state => {
	return {
		view: state.settings.view,
		fullscreen: state.settings.fullscreen
	}
}

export default connect(mapStateToProps)(Sidebar);