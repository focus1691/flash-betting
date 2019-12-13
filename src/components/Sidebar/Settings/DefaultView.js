import AppBar from '@material-ui/core/AppBar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import React, { useState } from "react";

export default ({ defaultView, toggleDefaultView, saveSetting, premiumMember, classes }) => {

    const [changeMade, setChangeMade] = useState(false);

    const handleViewChange = () => e => {
        if (!premiumMember && e.target.value === "LadderView") return;
        
        setChangeMade(true);
        toggleDefaultView(e.target.value);
    };

    const renderSaveBtn = () => {
        if (!changeMade) return null;

        return (
            <button
                className={"save-btn"}
                onClick={e => {
                    saveSetting({ "settings.defaultView": defaultView });
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
                    Default View
                </Typography>
            </AppBar>
            {renderSaveBtn()}
            <RadioGroup
                aria-label="Default View"
                name="View"
                className={classes.group}
                value={defaultView}
                onChange={handleViewChange()}
            >
                <FormControlLabel
                    value="LadderView"
                    control={<Radio color="primary" />}
                    label="Ladder"
                    labelPlacement="end"
                />
                <FormControlLabel
                    value="GridView"
                    control={<Radio color="primary" />}
                    label="Grid"
                    labelPlacement="end"
                />
                <FormControlLabel
                    value="HomeView"
                    control={<Radio color="primary" />}
                    label="Home"
                    labelPlacement="end"
                />
            </RadioGroup>
        </>
    );
};