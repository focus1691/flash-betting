import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  setDefaultView,
  setTrainingBalance,
  toggleSound,
  toggleTools,
  toggleUnmatchedBets,
  toggleMatchedBets,
  toggleGraph,
  toggleMarketInformation,
  setWinMarketsOnly,
  toggleRules,
  toggleTrainingLadderAutoCenter,
  toggleLadderUnmatched,
  updateStakeBtn,
  updateLayBtn,
  updateRightClickTicks,
  setHorseRacingCountries,
} from '../../../actions/settings';
import DefaultView from './DefaultView';
import TrainingBank from './TrainingBank';
import Sounds from './Sounds';
import Tools from './Tools';
import UnmatchedBets from './UnmatchedBets';
import MatchedBets from './MatchedBets';
import Graphs from './Graphs';
import MarketInformation from './MarketInformation';
import WinMarkets from './WinMarkets';
import Rules from './Rules';
import LadderAutoCenter from './LadderAutoCenter';
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
  setTrainingBalance,
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
  trainingLadderAutoCenter,
  toggleTrainingLadderAutoCenter,
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

  const saveSetting = (setting) => {
    fetch('/api/save-user-settings', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(setting),
    });
  };

  return (
    <div>
      <DefaultView defaultView={defaultView} toggleDefaultView={setDefaultView} saveSetting={saveSetting} premiumMember={premiumMember} classes={classes} />

      <TrainingBank receiveTrainingBalance={(balance) => setTrainingBalance(balance)} styles={classes} />

      <Sounds sounds={sounds} toggleSounds={toggleSound} saveSetting={saveSetting} classes={classes} />

      <Tools tools={tools} toggleTools={toggleTools} saveSetting={saveSetting} classes={classes} />

      <UnmatchedBets unmatchedBets={unmatchedBets} toggleUnmatchedBets={toggleUnmatchedBets} saveSetting={saveSetting} classes={classes} />

      <MatchedBets matchedBets={matchedBets} toggleMatchedBets={toggleMatchedBets} saveSetting={saveSetting} classes={classes} />

      <Graphs graphs={graphs} toggleGraph={toggleGraph} saveSetting={saveSetting} classes={classes} />

      <MarketInformation marketInfo={marketInfo} toggleMarketInformation={toggleMarketInformation} saveSetting={saveSetting} classes={classes} />

      <WinMarkets winMarketsOnly={winMarketsOnly} updateWinMarketsOnly={setWinMarketsOnly} saveSetting={saveSetting} classes={classes} />

      <Rules rules={rules} toggleRules={toggleRules} saveSetting={saveSetting} classes={classes} />

      <LadderAutoCenter trainingLadderAutoCenter={trainingLadderAutoCenter} toggleTrainingLadderAutoCenter={toggleTrainingLadderAutoCenter} saveSetting={saveSetting} classes={classes} />

      <LadderUnmatchedCol ladderUnmatched={ladderUnmatched} toggleLadderUnmatched={toggleLadderUnmatched} saveSetting={saveSetting} classes={classes} />

      <StakeButtons stakeBtns={stakeBtns} updateStakeBtn={updateStakeBtn} saveSetting={saveSetting} classes={classes} />

      <LayButtons layBtns={layBtns} updateLayBtn={updateLayBtn} saveSetting={saveSetting} classes={classes} />

      <RightClickTicks rightClickTicks={rightClickTicks} updateRightClickTicks={updateRightClickTicks} saveSetting={saveSetting} classes={classes} />

      <HorseRacing horseRaces={horseRaces} toggleHorseRaces={setHorseRacingCountries} saveSetting={saveSetting} classes={classes} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  premiumMember: state.settings.premiumMember,
  defaultView: state.settings.defaultView,
  view: state.settings.view,
  trainingBalance: state.settings.trainingBalance,
  sounds: state.settings.sounds,
  tools: state.settings.tools,
  unmatchedBets: state.settings.unmatchedBets,
  matchedBets: state.settings.matchedBets,
  graphs: state.settings.graphs,
  marketInfo: state.settings.marketInfo,
  winMarketsOnly: state.settings.winMarketsOnly,
  rules: state.settings.rules,
  trainingLadderAutoCenter: state.settings.trainingLadderAutoCenter,
  ladderUnmatched: state.settings.ladderUnmatched,
  stakeBtns: state.settings.stakeBtns,
  layBtns: state.settings.layBtns,
  rightClickTicks: state.settings.rightClickTicks,
  horseRaces: state.settings.horseRaces,
});

const mapDispatchToProps = {
  setDefaultView,
  setTrainingBalance,
  toggleSound,
  toggleTools,
  toggleUnmatchedBets,
  toggleMatchedBets,
  toggleGraph,
  toggleMarketInformation,
  setWinMarketsOnly,
  toggleRules,
  toggleTrainingLadderAutoCenter,
  toggleLadderUnmatched,
  updateStakeBtn,
  updateLayBtn,
  updateRightClickTicks,
  setHorseRacingCountries,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
