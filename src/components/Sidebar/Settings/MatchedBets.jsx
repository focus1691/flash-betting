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

export default ({ matchedBets, toggleMatchedBets, classes }) => {
  const [changeMade, setChangeMade] = useState(false);

  const renderSaveBtn = () => {
    if (!changeMade) return null;

    return (
      <button
        type="button"
        className={classes.saveBtn}
        onClick={() => {
          setChangeMade(false);
          setItem('matchedBets', matchedBets);
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
            Matched Bets
          </Typography>
        </AppBar>
      </SectionContent>
      <FormControlLabel
        className={classes.checkboxes}
        control={(
          <Checkbox
            value="checkedB"
            checked={matchedBets.visible}
            onChange={() => {
              setChangeMade(true);
              toggleMatchedBets({ visible: !matchedBets.visible });
            }}
          />
        )}
        label="Visible"
      />
      {renderSaveBtn()}
    </SectionBar>
  );
};
