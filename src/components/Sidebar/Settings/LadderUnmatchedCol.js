import React, { useState } from "react";
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

export default ({ ladderUnmatched, toggleLadderUnmatched, saveSetting, classes }) => {

    const [changeMade, setChangeMade] = useState(false);

    const renderSaveBtn = () => {
        if (!changeMade) return null;

        return (
            <button
                className={"save-btn"}
                onClick={e => {
                    saveSetting({ "settings.ladderUnmatched": ladderUnmatched });
                    setChangeMade(false);
                }}
            >
                <img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
            </button>
        );
    };

    return (
        <>
			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
					Ladder Unmatched Column
				</Typography>
			</AppBar>
            {renderSaveBtn()}
			<RadioGroup
				aria-label="Unmatched Column"
				name="unmatched "
				className={classes.group}
				value={ladderUnmatched}
				onChange={e => {
                    setChangeMade(true);
					toggleLadderUnmatched(e.target.value);
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
					label="Unmatched Bets + P/L"
					labelPlacement="end"
				/>
				<FormControlLabel
					value="hedged"
					control={<Radio color="primary" />}
					label="Unmatched Bets + Hedge"
					labelPlacement="end"
				/>
			</RadioGroup>
        </>
    );
};