import React from "react";
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

export default ({ toggleSounds, onSave, styles }) => (
    <div>
        <AppBar className={styles.appBar} position="static">
            <Typography variant="h6" className={styles.title}>
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
    </div>
);