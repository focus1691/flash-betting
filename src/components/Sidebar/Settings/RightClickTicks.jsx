import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { setItem } from '../../../localStorage/settings';

export default ({ rightClickTicks, updateRightClickTicks, classes }) => {
  const [changeMade, setChangeMade] = useState(false);

  const renderSaveBtn = () => {
    if (!changeMade) return null;

    return (
      <button
        className="save-btn"
        onClick={() => {
          setChangeMade(false);
          setItem('rightClickTicks', rightClickTicks);
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
          Right-click Ticks
        </Typography>
      </AppBar>
      <TextField
        id="standard-number"
        className={classes.textField}
        type="number"
        value={rightClickTicks}
        inputProps={{ min: '1' }}
        onChange={(e) => {
          setChangeMade(true);
          const val = parseInt(e.target.value);
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
