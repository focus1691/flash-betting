import React, { useState } from 'react';
//* @material-ui core
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { setItem } from '../../../localStorage/settings';
//* Custom @material-ui components
import SectionBar from '../../../jss/components/Sidebar/SectionBar';
import SectionContent from '../../../jss/components/Sidebar/SectionContent';

export default ({ winMarketsOnly, updateWinMarketsOnly, classes }) => {
  const [changeMade, setChangeMade] = useState(false);

  const renderSaveBtn = () => {
    if (!changeMade) return null;

    return (
      <button
        type="button"
        className={classes.saveBtn}
        onClick={() => {
          setItem('winMarketsOnly', winMarketsOnly);
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
        <AppBar className={classes.appBar} position="static">
          <Typography variant="h6" className={classes.title}>
            Win Markets
          </Typography>
        </AppBar>
      </SectionContent>
      <FormControlLabel
        control={(
          <Checkbox
            value="checkedB"
            color="primary"
            checked={winMarketsOnly}
            onChange={() => {
              setChangeMade(true);
              updateWinMarketsOnly(!winMarketsOnly);
            }}
          />
        )}
        label="Win Markets Only"
      />
      {renderSaveBtn()}
    </SectionBar>
  );
};
