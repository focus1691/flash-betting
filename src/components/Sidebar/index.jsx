import React, { useState } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import $ from 'jquery';
import { ThemeProvider } from '@material-ui/styles';
//* @material-ui core
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import { createMuiTheme } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
//* @material-ui icons
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
//* Components
import Account from './Account';
import Toolbar from './Toolbar';
import Event from './Event';
import Menu from './Menu';
import Market from './Market';
import Settings from './Settings';
import BootstrapButton from '../../jss/components/bootstrapButton';
//* JSS
import useStyles from '../../jss/components/Sidebar';

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

const Sidebar = ({ fullscreen }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [openTab, setOpenTab] = useState(2);
  const activeStyle = '#404040';

  const changeTab = (tab) => () => {
    setOpenTab(tab);
  };

  const handleDrawerOpen = () => {
    $(`.${classes.sidebar}`).animate({ width: '16.5rem' }, 200, 'swing', () => setOpen(true));
  };

  const handleDrawerClose = () => {
    $(`.${classes.sidebar}`).animate({ width: '0px' }, 200, 'swing', () => setOpen(false) );
  };

  const createToggleButton = (name, tab) => (
    <ThemeProvider theme={theme}>
      <BootstrapButton variant="contained" style={openTab === tab ? { background: activeStyle } : {}} onClick={changeTab(tab)} className={classes.toggleButton}>
        <img alt="" src={`${window.location.origin}/icons/${name}_Icon.svg`} />
        {name}
      </BootstrapButton>
    </ThemeProvider>
  );

  const renderActiveTab = () => {
    switch (openTab) {
      case 1:
        return <Menu />;
      case 2:
        return <Market />;
      case 3:
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <>
      <Drawer
        className={classes.sidebar}
        variant="persistent"
        open
        classes={{
          paper: classes.sidebar,
        }}
        anchor="left"
      >
        <div className={classes.topSection}>
          <div className={classes.drawerHeader}>
            <IconButton className={classes.toggleSidebarButton} onClick={handleDrawerClose}><ChevronLeftIcon /></IconButton>
          </div>
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
      {!open ? <IconButton className={clsx(classes.toggleSidebarButton, classes.openSideBarButton)} onClick={handleDrawerOpen}><ChevronRightIcon /></IconButton> : null}
    </>
  )
};

const mapStateToProps = (state) => ({
  fullscreen: state.settings.fullscreen,
});

export default connect(mapStateToProps)(Sidebar);
