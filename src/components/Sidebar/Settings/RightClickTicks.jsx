import React, { useState } from 'react';
//* @material-ui core
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { setItem } from '../../../localStorage/settings';
//* Custom @material-ui components
import SectionBar from '../../../jss/components/Sidebar/SectionBar';
import SectionContent from '../../../jss/components/Sidebar/SectionContent';

export default ({ rightClickTicks, updateRightClickTicks, classes }) => {
  const [changeMade, setChangeMade] = useState(false);

  const renderSaveBtn = () => {
    if (!changeMade) return null;

    return (
      <button
        type="button"
        className={classes.saveBtn}
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
    <SectionBar>
      <SectionContent>
        <AppBar className={classes.appBar} position="static">
          <Typography variant="h6" className={classes.title}>
            Right-click Ticks
          </Typography>
        </AppBar>
      </SectionContent>
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
    </SectionBar>
  );
};
