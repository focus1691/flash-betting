import React, { useState } from "react";
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

export default ({ rightClickTicks, updateRightClickTicks, saveSetting, classes }) => {

    const [changeMade, setChangeMade] = useState(false);

    const renderSaveBtn = () => {
        if (!changeMade) return null;

        return (
            <button
                className={"save-btn"}
                onClick={e => {
                    setChangeMade(false);
                    saveSetting({"settings.rightClickTicks": rightClickTicks});
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
                    Right-click Ticks
				</Typography>
            </AppBar>
            <TextField
                id="standard-number"
                className={classes.textField}
                type="number"
                value={rightClickTicks}
                inputProps={{ min: "1" }}
                onChange={e => {
                    setChangeMade(true);
                    let val = parseInt(e.target.value);
                    if (val && typeof val === 'number') {
                        updateRightClickTicks(val);
                    }
                }}
                margin="normal"
            />
            {renderSaveBtn()}
        </>
    );
};