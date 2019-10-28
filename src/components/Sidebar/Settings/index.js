import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions/settings';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Checkbox from '@material-ui/core/Checkbox';
import TrainingBank from "./TrainingBank";

const useStyles = makeStyles(theme => ({
	appBar: {
		background: "#303030",
		color: "orange",
		fontWeight: "900",
		border: "2px solid #fff"
	},
	title: {
		textAlign: "center",
		fontWeight: "bold"
	},
	group: {
		margin: theme.spacing(1, 0)
	},
	textField: {
		width: 50,
		margin: theme.spacing(2),
	},
}));

const Settings = props => {
	const classes = useStyles();

	const saveSetting = setting => {
		fetch(`/api/save-user-settings`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(setting)
		});
	};

	const handleChange = () => {

	};

	return (
		<div>

			<TrainingBank
				receiveTrainingBalance={balance => props.onReceiveTrainingBalance(balance)}
				styles={classes}
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
						checked={props.sounds}
						onChange={val => props.onToggleSounds(!props.sounds)}
					/>
				}
				label="Sounds"
			/>
			<button className={"save-btn"} onClick={e => saveSetting({ "settings.sounds": props.sounds })}><img alt={"Save"} src={window.location.origin + '/icons/save.png'} /></button>

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
						onChange={val => props.onToggleTools({ visible: !props.tools.visible, open: props.tools.open })}
					/>
				}
				label="Show Panel"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					"settings.tools": { visible: props.tools.visible, open: props.tools.open }
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.tools.open}
						onChange={val => props.onToggleTools({ visible: props.tools.visible, open: !props.tools.open })}
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
						onChange={val => props.onToggleUnmatchedBets({ visible: !props.unmatchedBets.visible, open: props.unmatchedBets.open })}
					/>
				}
				label="Show Panel"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					"settings.unmatchedBets": { visible: props.unmatchedBets.visible, open: props.unmatchedBets.open }
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.unmatchedBets.open}
						onChange={val => props.onToggleUnmatchedBets({ visible: props.unmatchedBets.visible, open: !props.unmatchedBets.open })}
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
						onChange={val => props.onToggleMatchedBets({ visible: !props.matchedBets.visible, open: props.matchedBets.open })}
					/>
				}
				label="Show Panel"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					"settings.matchedBets": { visible: props.matchedBets.visible, open: props.matchedBets.open }
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.matchedBets.open}
						onChange={val => props.onToggleMatchedBets({ visible: props.matchedBets.visible, open: !props.matchedBets.open })}
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
						onChange={val => props.onToggleGraph({ visible: !props.graphs.visible, open: props.graphs.open })}
					/>
				}
				label="Show Panel"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					"settings.graphs": { visible: props.graphs.visible, open: props.graphs.open }
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.graphs.open}
						onChange={val => props.onToggleGraph({ visible: props.graphs.visible, open: !props.graphs.open })}
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
						onChange={val => props.onToggleMarketInformation({ visible: !props.marketInfo.visible, open: props.marketInfo.open })}
					/>
				}
				label="Show Panel"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					"settings.marketInfo": { visible: props.marketInfo.visible, open: props.marketInfo.open }
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.marketInfo.open}
						onChange={val => props.onToggleMarketInformation({ visible: props.marketInfo.visible, open: !props.marketInfo.open })}
					/>
				}
				label="Panel Open"
			/>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Win Markets
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.trainingLadderAutoCenter}
						// onChange={val => props.onToggleTrainingLadderAutoCenter(!props.trainingLadderAutoCenter)}
					/>
				}
				label="Win Markets Only"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					"settings.trainingLadderAutoCenter": props.trainingLadderAutoCenter
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>

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
						onChange={val => props.onToggleRules({ visible: !props.rules.visible, open: props.rules.open })}
					/>
				}
				label="Show Panel"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					"settings.rules": { visible: props.rules.visible, open: props.rules.open }
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={props.rules.open}
						onChange={val => props.onToggleRules({ visible: props.rules.visible, open: !props.rules.open })}
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
						checked={props.trainingLadderAutoCenter}
						onChange={val => props.onToggleTrainingLadderAutoCenter(!props.trainingLadderAutoCenter)}
					/>
				}
				label="Default to ON"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					"settings.trainingLadderAutoCenter": props.trainingLadderAutoCenter
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Ladder Unmatched Column
				</Typography>
			</AppBar>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({
					"settings.ladderUnmatched": props.ladderUnmatched
				})}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>
			<RadioGroup
				aria-label="gender"
				name="gender2"
				className={classes.group}
				value={props.ladderUnmatched}
				onChange={e => {
					props.onToggleLadderUnmatched(e.target.value);
				}}
			>
				<FormControlLabel
					value="blank"
					control={<Radio color="primary" />}
					label="Unmatched Bets Only"
					labelPlacement="end"
				/>
				<FormControlLabel
					value="pl"
					control={<Radio color="primary" />}
					label="Umatched Bets + P/L"
					labelPlacement="end"
				/>
				<FormControlLabel
					value="hedged"
					control={<Radio color="primary" />}
					label="Unmatched Bets + Hedge"
					labelPlacement="end"
				/>
			</RadioGroup>

			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Stake Button
				</Typography>
			</AppBar>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="One"
				value={`${props.stakeBtns[0]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						props.onUpdateStakeBtn({ id: 0, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Two"
				value={`${props.stakeBtns[1]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						props.onUpdateStakeBtn({ id: 1, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Three"
				value={`${props.stakeBtns[2]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						props.onUpdateStakeBtn({ id: 2, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Four"
				value={`${props.stakeBtns[3]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						props.onUpdateStakeBtn({ id: 3, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Five"
				value={`${props.stakeBtns[4]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						props.onUpdateStakeBtn({ id: 4, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Six"
				value={`${props.stakeBtns[5]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						props.onUpdateStakeBtn({ id: 5, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Seven"
				value={`${props.stakeBtns[6]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						props.onUpdateStakeBtn({ id: 6, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({ "settings.stakeBtns": props.stakeBtns })}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>



			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Liability Button
				</Typography>
			</AppBar>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="One"
				value={`${props.layBtns[0]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						props.onUpdateLayBtn({ id: 0, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Two"
				value={`${props.layBtns[1]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						props.onUpdateLayBtn({ id: 1, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Three"
				value={`${props.layBtns[2]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						props.onUpdateLayBtn({ id: 2, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Four"
				value={`${props.layBtns[3]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						props.onUpdateLayBtn({ id: 3, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Five"
				value={`${props.layBtns[4]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						props.onUpdateLayBtn({ id: 4, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Six"
				value={`${props.layBtns[5]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						props.onUpdateLayBtn({ id: 5, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Seven"
				value={`${props.layBtns[6]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						props.onUpdateLayBtn({ id: 6, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<button
				className={"save-btn"}
				onClick={e => saveSetting({ "settings.layBtns": props.layBtns })}
			>
				<img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
			</button>

		</div>
	);
};

const mapStateToProps = state => {
	return {
		trainingBalance: state.settings.trainingBalance,
		sounds: state.settings.sounds,
		tools: state.settings.tools,
		unmatchedBets: state.settings.unmatchedBets,
		matchedBets: state.settings.matchedBets,
		graphs: state.settings.graphs,
		marketInfo: state.settings.marketInfo,
		rules: state.settings.rules,
		trainingLadderAutoCenter: state.settings.trainingLadderAutoCenter,
		ladderUnmatched: state.settings.ladderUnmatched,
		stakeBtns: state.settings.stakeBtns,
		layBtns: state.settings.layBtns
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onReceiveTrainingBalance: balance => dispatch(actions.setTrainingBalance(balance)),
		onToggleSounds: isSelected => dispatch(actions.toggleSound(isSelected)),
		onToggleTools: settings => dispatch(actions.toggleTools(settings)),
		onToggleUnmatchedBets: settings => dispatch(actions.toggleUnmatchedBets(settings)),
		onToggleMatchedBets: settings => dispatch(actions.toggleMatchedBets(settings)),
		onToggleGraph: settings => dispatch(actions.toggleGraph(settings)),
		onToggleMarketInformation: settings => dispatch(actions.toggleMarketInformation(settings)),
		onToggleRules: settings => dispatch(actions.toggleRules(settings)),
		onToggleTrainingLadderAutoCenter: settings => dispatch(actions.toggleTrainingLadderAutoCenter(settings)),
		onToggleLadderUnmatched: unmatchedColumn => dispatch(actions.toggleLadderUnmatched(unmatchedColumn)),
		onUpdateStakeBtn: data => dispatch(actions.updateStakeBtn(data)),
		onUpdateLayBtn: data => dispatch(actions.updateLayBtn(data))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);