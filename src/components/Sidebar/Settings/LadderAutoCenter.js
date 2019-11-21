import React, { useState } from "react";
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default ({ trainingLadderAutoCenter, toggleTrainingLadderAutoCenter, saveSetting, classes }) => {

    const [changeMade, setChangeMade] = useState(false);

    const renderSaveBtn = () => {
        if (!changeMade) return null;

        return (
            <button
                className={"save-btn"}
                onClick={e => {
                    saveSetting({ "settings.trainingLadderAutoCenter": trainingLadderAutoCenter });
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
					Training Ladder Auto-Center
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={trainingLadderAutoCenter}
						onChange={event => {
                            setChangeMade(true);
                            toggleTrainingLadderAutoCenter(!trainingLadderAutoCenter);
                        }}
					/>
				}
				label="Default to ON"
			/>
            {renderSaveBtn()}
        </>
    );
};