import React, { useState } from 'react';
//* @material-ui core
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { setItem } from '../../../localStorage/settings';
//* Custom @material-ui components
import SectionBar from '../../../jss/components/Sidebar/SectionBar';
import SectionContent from '../../../jss/components/Sidebar/SectionContent';

export default ({ stakeBtns, updateStakeBtn, classes }) => {
  const [changeMade, setChangeMade] = useState(false);

  const renderSaveBtn = () => {
    if (!changeMade) return null;

    return (
      <button
        type="button"
        className={classes.saveBtn}
        onClick={() => {
          setItem('stakeBtns', stakeBtns);
          setChangeMade(false);
        }}
      >
        <img alt="Save" src={`${window.location.origin}/icons/Save_Button.svg`} />
      </button>
    );
  };

  return (
    <SectionBar>
      <SectionContent>
        <AppBar className={classes.appBar} position="absolute">
          <Typography variant="h6" className={classes.title}>
            Stake Button
          </Typography>
        </AppBar>
      </SectionContent>
      {renderSaveBtn()}
      <div className={classes.stakeButtons}>
        <TextField
          className={classes.textField}
          type="number"
          label="One"
          value={`${stakeBtns[0]}`}
          inputProps={{ min: '1' }}
          onChange={(e) => {
            setChangeMade(true);
            const val = parseInt(e.target.value);
            if (val && typeof val === 'number') {
              updateStakeBtn({ id: 0, value: e.target.value });
            }
          }}
          margin="normal"
        />
        <TextField
          className={classes.textField}
          type="number"
          label="Two"
          value={`${stakeBtns[1]}`}
          inputProps={{ min: '1' }}
          onChange={(e) => {
            setChangeMade(true);
            const val = parseInt(e.target.value);
            if (val && typeof val === 'number') {
              updateStakeBtn({ id: 1, value: e.target.value });
            }
          }}
          margin="normal"
        />
        <TextField
          className={classes.textField}
          type="number"
          label="Three"
          value={`${stakeBtns[2]}`}
          inputProps={{ min: '1' }}
          onChange={(e) => {
            setChangeMade(true);
            const val = parseInt(e.target.value);
            if (val && typeof val === 'number') {
              updateStakeBtn({ id: 2, value: e.target.value });
            }
          }}
          margin="normal"
        />
        <TextField
          className={classes.textField}
          type="number"
          label="Four"
          value={`${stakeBtns[3]}`}
          inputProps={{ min: '1' }}
          onChange={(e) => {
            setChangeMade(true);
            const val = parseInt(e.target.value);
            if (val && typeof val === 'number') {
              updateStakeBtn({ id: 3, value: e.target.value });
            }
          }}
          margin="normal"
        />
        <TextField
          className={classes.textField}
          type="number"
          label="Five"
          value={`${stakeBtns[4]}`}
          inputProps={{ min: '1' }}
          onChange={(e) => {
            setChangeMade(true);
            const val = parseInt(e.target.value);
            if (val && typeof val === 'number') {
              updateStakeBtn({ id: 4, value: e.target.value });
            }
          }}
          margin="normal"
        />
        <TextField
          className={classes.textField}
          type="number"
          label="Six"
          value={`${stakeBtns[5]}`}
          inputProps={{ min: '1' }}
          onChange={(e) => {
            setChangeMade(true);
            const val = parseInt(e.target.value);
            if (val && typeof val === 'number') {
              updateStakeBtn({ id: 5, value: e.target.value });
            }
          }}
          margin="normal"
        />
        <TextField
          className={classes.textField}
          type="number"
          label="Seven"
          value={`${stakeBtns[6]}`}
          inputProps={{ min: '1' }}
          onChange={(e) => {
            setChangeMade(true);
            const val = parseInt(e.target.value);
            if (val && typeof val === 'number') {
              updateStakeBtn({ id: 6, value: e.target.value });
            }
          }}
          margin="normal"
        />
      </div>
    </SectionBar>
  );
};
