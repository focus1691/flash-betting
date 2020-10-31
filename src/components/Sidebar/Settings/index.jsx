import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  setDefaultView,
  toggleSound,
  toggleTools,
  toggleUnmatchedBets,
  toggleMatchedBets,
  toggleGraph,
  toggleMarketInformation,
  setWinMarketsOnly,
  toggleRules,
  toggleLadderUnmatched,
  updateStakeBtn,
  updateLayBtn,
  updateRightClickTicks,
  setHorseRacingCountries,
} from '../../../actions/settings';
import DefaultView from './DefaultView';
import Sounds from './Sounds';
import Tools from './Tools';
import UnmatchedBets from './UnmatchedBets';
import MatchedBets from './MatchedBets';
import Graphs from './Graphs';
import MarketInformation from './MarketInformation';
import WinMarkets from './WinMarkets';
import Rules from './Rules';
import LadderUnmatchedCol from './LadderUnmatchedCol';
import StakeButtons from './StakeButtons';
import LayButtons from './LayButtons';
import RightClickTicks from './RightClickTicks';
import HorseRacing from './HorseRacing';

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: '#303030',
    color: 'orange',
    fontWeight: '900',
    border: '2px solid #fff',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  group: {
    margin: theme.spacing(1, 0),
  },
  textField: {
    width: 50,
    margin: theme.spacing(2),
  },
}));

const Settings = ({
  premiumMember,
  defaultView,
  setDefaultView,
  sounds,
  toggleSound,
  tools,
  toggleTools,
  unmatchedBets,
  toggleUnmatchedBets,
  matchedBets,
  toggleMatchedBets,
  graphs,
  toggleGraph,
  marketInfo,
  toggleMarketInformation,
  winMarketsOnly,
  setWinMarketsOnly,
  rules,
  toggleRules,
  ladderUnmatched,
  toggleLadderUnmatched,
  stakeBtns,
  updateStakeBtn,
  layBtns,
  updateLayBtn,
  rightClickTicks,
  updateRightClickTicks,
  horseRaces,
  setHorseRacingCountries,
}) => {
  const classes = useStyles();

  return (
    <div>
      <DefaultView defaultView={defaultView} toggleDefaultView={setDefaultView} premiumMember={premiumMember} classes={classes} />

      <Sounds sounds={sounds} toggleSounds={toggleSound} classes={classes} />

      <Tools tools={tools} toggleTools={toggleTools} classes={classes} />

      <UnmatchedBets unmatchedBets={unmatchedBets} toggleUnmatchedBets={toggleUnmatchedBets} classes={classes} />

      <MatchedBets matchedBets={matchedBets} toggleMatchedBets={toggleMatchedBets} classes={classes} />

      <Graphs graphs={graphs} toggleGraph={toggleGraph} classes={classes} />

      <MarketInformation marketInfo={marketInfo} toggleMarketInformation={toggleMarketInformation} classes={classes} />

      <WinMarkets winMarketsOnly={winMarketsOnly} updateWinMarketsOnly={setWinMarketsOnly} classes={classes} />

      <Rules rules={rules} toggleRules={toggleRules} classes={classes} />

      <LadderUnmatchedCol ladderUnmatched={ladderUnmatched} toggleLadderUnmatched={toggleLadderUnmatched} classes={classes} />

      <StakeButtons stakeBtns={stakeBtns} updateStakeBtn={updateStakeBtn} classes={classes} />

      <LayButtons layBtns={layBtns} updateLayBtn={updateLayBtn} classes={classes} />

      <RightClickTicks rightClickTicks={rightClickTicks} updateRightClickTicks={updateRightClickTicks} classes={classes} />

      <HorseRacing horseRaces={horseRaces} toggleHorseRaces={setHorseRacingCountries} classes={classes} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  premiumMember: state.settings.premiumMember,
  defaultView: state.settings.defaultView,
  view: state.settings.view,
  sounds: state.settings.sounds,
  tools: state.settings.tools,
  unmatchedBets: state.settings.unmatchedBets,
  matchedBets: state.settings.matchedBets,
  graphs: state.settings.graphs,
  marketInfo: state.settings.marketInfo,
  winMarketsOnly: state.settings.winMarketsOnly,
  rules: state.settings.rules,
  ladderUnmatched: state.settings.ladderUnmatched,
  stakeBtns: state.settings.stakeBtns,
  layBtns: state.settings.layBtns,
  rightClickTicks: state.settings.rightClickTicks,
  horseRaces: state.settings.horseRaces,
});

const mapDispatchToProps = {
  setDefaultView,
  toggleSound,
  toggleTools,
  toggleUnmatchedBets,
  toggleMatchedBets,
  toggleGraph,
  toggleMarketInformation,
  setWinMarketsOnly,
  toggleRules,
  toggleLadderUnmatched,
  updateStakeBtn,
  updateLayBtn,
  updateRightClickTicks,
  setHorseRacingCountries,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
