import React from 'react';
import useStyles from '../Styles/Styles.jsx';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Checkbox from '@material-ui/core/Checkbox';

const Settings = () => {
	const classes = useStyles();
	
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
				value="1000"
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
				  />
				}
				label="Show Panel"
			/>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
				    color="primary"
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
				  />
				}
				label="Show Panel"
			/>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
				    color="primary"
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
				  />
				}
				label="Show Panel"
			/>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
				    color="primary"
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
				  />
				}
				label="Show Panel"
			/>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
				    color="primary"
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
				  />
				}
				label="Show Panel"
			/>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
				    color="primary"
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
				  />
				}
				label="Show Panel"
			/>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
				    color="primary"
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
				  />
				}
				label="Show Panel"
			/>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
				    color="primary"
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
				  />
				}
				label="Show Panel"
			/>
			<FormControlLabel
				control={
				  <Checkbox
				    value="checkedB"
				    color="primary"
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

const handleChange = () => {
	return;
};

export default Settings;