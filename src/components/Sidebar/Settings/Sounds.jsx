import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { setItem } from '../../../localStorage/settings';

export default ({ sounds, toggleSounds, classes }) => {
  const [changeMade, setChangeMade] = useState(false);

  const renderSaveBtn = () => {
    if (!changeMade) return null;

    return (
      <button
        className="save-btn"
        onClick={() => {
          setItem('sounds', sounds);
          setChangeMade(false);
        }}
      >
        <img alt="Save" src={`${window.location.origin}/icons/save.png`} />
      </button>
    );
  };

  return (
    <>
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
            checked={sounds}
            onChange={(val) => {
              setChangeMade(true);
              toggleSounds(!sounds);
            }}
          />
        }
        label="Sounds"
      />
      {renderSaveBtn()}
    </>
  );
};
