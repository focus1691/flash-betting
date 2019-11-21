import React, { useState } from "react";
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default ({ rules, toggleRules, saveSetting, classes }) => {

    const [changeMade, setChangeMade] = useState(false);

    const renderSaveBtn = () => {
        if (!changeMade) return null;

        return (
            <button
                className={"save-btn"}
                onClick={e => {
                    saveSetting({ "settings.rules": { visible: rules.visible, open: rules.open } });
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
					Rules
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={rules.visible}
						onChange={val => {
                            setChangeMade(true);
                            toggleRules({ visible: !rules.visible, open: rules.open });
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
						checked={rules.open}
						onChange={val => {
                            setChangeMade(true);
                            toggleRules({ visible: rules.visible, open: !rules.open });
                        }}
					/>
				}
				label="Panel Open"
			/>
        </>
    );
};