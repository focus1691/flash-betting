import React, { useState } from "react";
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default ({ marketInfo, toggleMarketInformation, saveSetting, classes }) => {

    const [changeMade, setChangeMade] = useState(false);

    const renderSaveBtn = () => {
        if (!changeMade) return null;

        return (
            <button
                className={"save-btn"}
                onClick={e => {
                    saveSetting({ "settings.marketInfo": { visible: marketInfo.visible, open: marketInfo.open } });
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
                    Market Information
				</Typography>
            </AppBar>
            <FormControlLabel
                control={
                    <Checkbox
                        value="checkedB"
                        color="primary"
                        checked={marketInfo.visible}
                        onChange={e => {
                            setChangeMade(true);
                            toggleMarketInformation({ visible: !marketInfo.visible, open: marketInfo.open });
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
                        checked={marketInfo.open}
                        onChange={e => {
                            setChangeMade(true);
                            toggleMarketInformation({ visible: marketInfo.visible, open: !marketInfo.open });
                        }}
                    />
                }
                label="Panel Open"
            />
        </>
    );
};