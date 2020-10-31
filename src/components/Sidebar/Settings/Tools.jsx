import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { setItem } from '../../../localStorage/settings';

export default ({ tools, toggleTools, classes }) => {
  const [changeMade, setChangeMade] = useState(false);

  const renderSaveBtn = () => {
    if (!changeMade) return null;

    return (
      <button
        className="save-btn"
        onClick={() => {
          setChangeMade(false);
          setItem('tools', tools);
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
          Tools
        </Typography>
      </AppBar>
      <FormControlLabel
        control={
          <Checkbox
            value="checkedB"
            color="primary"
            checked={tools.visible}
            onChange={(e) => {
              setChangeMade(true);
              toggleTools({ visible: !tools.visible, open: tools.open });
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
            checked={tools.open}
            onChange={(e) => {
              setChangeMade(true);
              toggleTools({ visible: tools.visible, open: !tools.open });
            }}
          />
        }
        label="Panel Open"
      />
    </>
  );
};
