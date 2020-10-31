import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { setItem } from '../../../localStorage/settings';

export default ({ rules, toggleRules, classes }) => {
  const [changeMade, setChangeMade] = useState(false);

  const renderSaveBtn = () => {
    if (!changeMade) return null;

    return (
      <button
        type="button"
        className="save-btn"
        onClick={() => {
          setItem('rules', rules);
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
          Rules
        </Typography>
      </AppBar>
      <FormControlLabel
        control={
          <Checkbox
            value="checkedB"
            color="primary"
            checked={rules.visible}
            onChange={() => {
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
            onChange={() => {
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
