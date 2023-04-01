import React, { useState } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import Popover from '@material-ui/core/Popover';
import { Button, Typography } from '@material-ui/core';
//* Actions
import { setActiveView, setFullscreen, openPremiumDialog } from '../../redux/actions/settings';
import { openLiveStream } from '../../redux/actions/draggable';
//* JSS
import useStyles from '../../jss/components/Sidebar/toolbarStyle';

const Toolbar = ({ marketOpen, marketStatus, view, fullscreen, videoOpen, setActiveView, setFullscreen, openLiveStream }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);

  const handleClick = (view) => () => {
    setActiveView(view);
  };

  const toggleFullScreen = () => {
    setFullscreen(!fullscreen);
  };

  const handleReportClick = () => {
    if (!marketOpen && marketStatus === 'CLOSED') {
      setActiveView('ReportView');
    }
  };

  const handlePopoverOpen = (message) => (event) => {
    setAnchorEl(event.currentTarget);
    setPopupMessage(message);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className={classes.toolbar}>
      <Button
        type="button"
        onClick={toggleFullScreen}
        style={fullscreen ? { background: '#404040', transform: 'rotate(180deg)' } : {}}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen('Hide Balance')}
        onMouseLeave={handlePopoverClose}
      >
        <img alt="" src={`${window.location.origin}/icons/Triangle.svg`} />
      </Button>
      <Button
        type="button"
        onClick={openLiveStream}
        style={videoOpen ? { background: '#404040' } : {}}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen('BetFair Video')}
        onMouseLeave={handlePopoverClose}
      >
        <img alt="" src={`${window.location.origin}/icons/tv.png`} />
      </Button>
      <Button
        type="button"
        onClick={handleClick('HomeView')}
        style={view === 'HomeView' ? { background: '#404040' } : {}}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen('Home View')}
        onMouseLeave={handlePopoverClose}
      >
        <img alt="" src={`${window.location.origin}/icons/chart.png`} />
      </Button>
      <Button
        type="button"
        onClick={null}
        style={view === 'LadderView' ? { background: '#404040' } : {}}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen('Ladder View')}
        onMouseLeave={handlePopoverClose}
      >
        <img alt="" src={`${window.location.origin}/icons/ladder.png`} />
      </Button>
      <Button
        type="button"
        onClick={handleClick('GridView')}
        style={view === 'GridView' ? { background: '#404040' } : {}}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen('Grid View')}
        onMouseLeave={handlePopoverClose}
      >
        <img alt="" src={`${window.location.origin}/icons/grid.png`} />
      </Button>
      <Button type="button" onClick={handleReportClick}>
        <img
          alt=""
          src={`${window.location.origin}/icons/report.png`}
          className={clsx({
            [classes.marketClosed]: !marketOpen && marketStatus === 'CLOSED',
          })}
          aria-owns={open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen('Market Report')}
          onMouseLeave={handlePopoverClose}
        />
      </Button>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography>{popupMessage}</Typography>
      </Popover>
    </div>
  );
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketStatus: state.market.status,
  view: state.settings.view,
  fullscreen: state.settings.fullscreen,
  videoOpen: state.draggable.liveStreamOpen,
});

const mapDispatchToProps = {
  setActiveView,
  setFullscreen,
  openPremiumDialog,
  openLiveStream,
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
