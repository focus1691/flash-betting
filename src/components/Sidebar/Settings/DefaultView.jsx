import React, { useState } from 'react';
//* @material-ui core
import AppBar from '@material-ui/core/AppBar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import { setItem } from '../../../localStorage/settings';
//* Custom @material-ui components
import SectionBar from '../../../jss/components/Sidebar/SectionBar';
import SectionContent from '../../../jss/components/Sidebar/SectionContent';

export default ({ defaultView, toggleDefaultView, premiumMember, classes }) => {
  const [changeMade, setChangeMade] = useState(false);

  const handleViewChange = () => (e) => {
    if (!premiumMember && e.target.value === 'LadderView') return;

    setChangeMade(true);
    toggleDefaultView(e.target.value);
  };

  const renderSaveBtn = () => {
    if (!changeMade) return null;

    return (
      <button
        type="button"
        className={classes.saveBtn}
        onClick={() => {
          setItem('defaultView', defaultView);
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
            Default View
          </Typography>
        </AppBar>        
      </SectionContent>
      {renderSaveBtn()}
      <RadioGroup aria-label="Default View" name="View" className={classes.radioButtons} value={defaultView} onChange={handleViewChange()}>
        <FormControlLabel value="LadderView" control={<Radio color="primary" />} label="Ladder" labelPlacement="end" />
        <FormControlLabel value="GridView" control={<Radio color="primary" />} label="Grid" labelPlacement="end" />
        <FormControlLabel value="HomeView" control={<Radio color="primary" />} label="Home" labelPlacement="end" />
      </RadioGroup>
    </SectionBar>
  );
};
