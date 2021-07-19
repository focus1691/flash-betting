import React from 'react';
import { connect } from 'react-redux';
//* Actions
import { setActiveView, setFullscreen, openPremiumDialog } from '../../redux/actions/settings';
import { openLiveStream } from '../../redux/actions/draggable';
//* JSS
import useStyles from '../../jss/components/Sidebar/toolbarStyle';

const Toolbar = ({ marketOpen, marketStatus, view, fullscreen, premiumMember, videoOpen, setActiveView, setFullscreen, openPremiumDialog, openLiveStream }) => {
  const classes = useStyles();
  const handleClick = (view) => () => {
    setActiveView(view);
  };

  const toggleFullScreen = () => {
    setFullscreen(!fullscreen);
  };

  const handleReportClick = () => {
    console.log(marketOpen, marketStatus);
    if (!marketOpen && marketStatus === 'CLOSED') {
      setActiveView('ReportView')
    }
  };

  return (
    <div className={classes.toolbar}>
      <button type="button" onClick={toggleFullScreen} style={fullscreen ? { background: '#404040', transform: 'rotate(180deg)' } : {}}>
        <img alt="" src={`${window.location.origin}/icons/Triangle.svg`} />
      </button>
      <button type="button" onClick={openLiveStream} style={videoOpen ? { background: '#404040' } : {}}>
        <img alt="" src={`${window.location.origin}/icons/Play.svg`} />
      </button>
      <button type="button" onClick={handleClick('HomeView')} style={view === 'HomeView' ? { background: '#404040' } : {}}>
        <img alt="" src={`${window.location.origin}/icons/Home.svg`} />
      </button>
      <button type="button" onClick={premiumMember ? handleClick('LadderView') : () => openPremiumDialog(true)} style={view === 'LadderView' ? { background: '#404040' } : {}}>
        <img alt="" src={`${window.location.origin}/icons/Ladder_View.svg`} />
      </button>
      <button type="button" onClick={handleClick('GridView')} style={view === 'GridView' ? { background: '#404040' } : {}}>
        <img alt="" src={`${window.location.origin}/icons/Grid_View.svg`} />
      </button>
      <button type="button" onClick={handleReportClick}>
        <img alt="" src={`${window.location.origin}/icons/notepad.svg`} />
      </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketStatus: state.market.status,
  view: state.settings.view,
  fullscreen: state.settings.fullscreen,
  premiumMember: state.settings.premiumMember,
  videoOpen: state.draggable.liveStreamOpen,
});

const mapDispatchToProps = {
  setActiveView,
  setFullscreen,
  openPremiumDialog,
  openLiveStream,
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
