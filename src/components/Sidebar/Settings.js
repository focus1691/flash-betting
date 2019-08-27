import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/settings';
import useStyles from '../Styles/Styles';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Checkbox from '@material-ui/core/Checkbox';

const Settings = props => {
	const classes = useStyles();

	const handleChange = () => {
		
	};

	const handleIt = (e, afa) => {
		console.log(afa);
	};

	// props.onReceiveTrainingBalance(400);

	props.onToggleLadderColourContrast(true);
	
	return (
		<div>
			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Training Bank
				</Typography>
			</AppBar>
			<TextField
				id="standard-name"
				label="Bank Balance"
				margin="normal"
				onChange={val => props.onReceiveTrainingBalance(val)}
			/>
			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Ladder Colour
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.ladderColourContrast}
						onChange={val => props.onToggleLadderColourContrast(val)}
				  />
				}
				label="Ladder Colour Contrast"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Sound
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						onChange={val => props.onToggleSounds(val)}
				  />
				}
				label="Sounds"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Tools
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.tools.visible}
				  />
				}
				label="Show Panel"
			/>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.tools.open}
				  />
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Unmatched Bets
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.unmatchedBets.visible}
				  />
				}
				label="Show Panel"
			/>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.unmatchedBets.open}
				  />
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Matched Bets
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.matchedBets.visible}
				  />
				}
				label="Show Panel"
			/>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.matchedBets.open}
				  />
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Profit & Loss
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.profitAndLoss.visible}
				  />
				}
				label="Show Panel"
			/>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.profitAndLoss.open}
				  />
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Projected SP
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.projectedSP.visible}
				  />
				}
				label="Show Panel"
			/>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.projectedSP.open}
				  />
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Graphs
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.graphs.visible}
						
				  />
				}
				label="Show Panel"
			/>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.graphs.visible}
				  />
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Market Information
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.marketInfo.visible}
				  />
				}
				label="Show Panel"
			/>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.marketInfo.visible}
				  />
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Rules
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.rules.visible}
				  />
				}
				label="Show Panel"
			/>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.rules.visible}
				  />
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Training Ladder Auto-Center
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
						color="primary"
						checked={props.rules.trainingLadderAutoCenter}
				  />
				}
				label="Default to ON"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Ladder Unmatched Column
				</Typography>
			</AppBar>
			<RadioGroup
				aria-label="gender"
				name="gender2"
				className={classes.group}
				value={34}
				onChange={handleChange}
			>
				<FormControlLabel
					value="female"
					control={<Radio color="primary" />}
					label="Unmatched Bets Only"
					labelPlacement="end"
				/>
				<FormControlLabel
					value="male"
					control={<Radio color="primary" />}
					label="Umatched Bets + P/L"
					labelPlacement="end"
				/>
				<FormControlLabel
					value="other"
					control={<Radio color="primary" />}
					label="Unmatched Bets + Hedge"
					labelPlacement="end"
				/>
			</RadioGroup>
		</div>
	);
};

const mapStateToProps = state => {
	return {
		trainingBalance: state.settings.trainingBalance,
		ladderColourContrast: state.settings.ladderColourContrast,
		sounds: state.settings.sounds,
		tools: state.settings.tools,
		unmatchedBets: state.settings.unmatchedBets,
		matchedBets: state.settings.matchedBets,
		profitAndLoss: state.settings.profitAndLoss,
		projectedSP: state.settings.projectedSP,
		graphs: state.settings.graphs,
		marketInfo: state.settings.marketInfo,
		rules: state.settings.rules,
		trainingLadderAutoCenter: state.settings.trainingLadderAutoCenter,
		ladderUnmatched: state.settings.ladderUnmatched
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onReceiveTrainingBalance: balance => dispatch(actions.setTrainingBalance(balance)),
		onToggleLadderColourContrast: isSelected => dispatch(actions.toggleLadderColourContrast(isSelected)),
		onToggleSounds: isSelected => dispatch(actions.toggleSound(isSelected)),
		onToggleTools: settings => dispatch(actions.toggleTools(settings)),
		onToggleUnmatchedBets: settings => dispatch(actions.toggleUnmatchedBets(settings)),
		onToggleMatchedBets: settings => dispatch(actions.toggleMatchedBets(settings)),
		onToggleProfitAndLoss: settings => dispatch(actions.toggleProfitAndLoss(settings)),
		onToggleProjectedSP: settings => dispatch(actions.toggleProjectedSP(settings)),
		onToggleGraph: settings => dispatch(actions.toggleGraph(settings)),
		onToggleMarketInformation: settings => dispatch(actions.toggleMarketInformation(settings)),
		onToggleRules: settings => dispatch(actions.toggleRules(settings)),
		onToggleTrainingLadderAutoCenter: settings => dispatch(actions.toggleTrainingLadderAutoCenter(settings)),
		onToggleLadderUnmatched: isSelected => dispatch(actions.toggleLadderUnmatched(isSelected))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);