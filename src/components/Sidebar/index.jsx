import React, { useState } from 'react';
import { connect } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
//* @material-ui core
import Drawer from '@material-ui/core/Drawer';
import { createMuiTheme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import Account from './Account';
import Toolbar from './Toolbar';
import Event from './Event';
import Menu from './Menu';
import Market from './Market';
import Settings from './Settings';
//* JSS
import useStyles from '../../jss/components/Sidebar';

const BootstrapButton = withStyles({
  root: {
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    lineHeight: 1.5,
    color: '#fff',
    backgroundColor: '#232323',
    fontWeight: 'bold',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Lato',
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

const Sidebar = ({ fullscreen }) => {
  const classes = useStyles();
  const [openTab, setOpenTab] = useState(2);
  const activeStyle = '#404040';

  const changeTab = (tab) => (e) => {
    setOpenTab(tab);
  };

  const createToggleButton = (name, tab) => (
    <ThemeProvider theme={theme}>
      <BootstrapButton
        variant="contained"
        style={openTab === tab ? { background: activeStyle } : {}}
        onClick={changeTab(tab)}
        className={classes.toggleButton}
      >
        {name}
      </BootstrapButton>
    </ThemeProvider>
  );

  const renderActiveTab = () => {
    switch (openTab) {
      case 1: return <Menu />;
      case 2: return <Market />;
      case 3: return <Settings />;
      default: return null;
    }
  };

  return (
    <Drawer
      className={classes.sidebar}
      variant="permanent"
      classes={{
        paper: classes.sidebar,
      }}
      anchor="left"
    >
      <div className={classes.topSection}>
        {fullscreen ? null : <Account />}
        <Toolbar />
        <Event />
        <div className={classes.menuButtons}>
          {createToggleButton('Menu', 1)}
          {createToggleButton('Market', 2)}
          {createToggleButton('Settings', 3)}
        </div>
      </div>
      {renderActiveTab()}
    </Drawer>
  );
};

const mapStateToProps = (state) => ({
  fullscreen: state.settings.fullscreen,
});

export default connect(mapStateToProps)(Sidebar);
