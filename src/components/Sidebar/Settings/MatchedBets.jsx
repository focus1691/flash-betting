import React, { useState } from "react";
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default ({ matchedBets, toggleMatchedBets, saveSetting, classes }) => {

    const [changeMade, setChangeMade] = useState(false);

    const renderSaveBtn = () => {
        if (!changeMade) return null;

        return (
            <button
                className={"save-btn"}
                onClick={e => {
                    setChangeMade(false);
                    saveSetting({"settings.matchedBets": { visible: matchedBets.visible, open: matchedBets.open }});
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
					Matched Bets
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={matchedBets.visible}
						onChange={e => {
                            setChangeMade(true);
                            toggleMatchedBets({ visible: !matchedBets.visible, open: matchedBets.open });
                            
                        }}
					/>
				}
				label="Show Panel"
			/>
            {renderSaveBtn()}
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={matchedBets.open}
						onChange={e => {
                            setChangeMade(true);
                            toggleMatchedBets({ visible: matchedBets.visible, open: !matchedBets.open });
                        }}
					/>
				}
				label="Panel Open"
			/>
        </>
    );
};