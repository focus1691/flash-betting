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

export default ({ graphs, toggleGraph, classes }) => {
  const [changeMade, setChangeMade] = useState(false);

  const renderSaveBtn = () => {
    if (!changeMade) return null;

    return (
      <button
        type="button"
        className={classes.saveBtn}
        onClick={() => {
          setItem('graphs', graphs);
          setChangeMade(false);
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
            Graphs
          </Typography>
        </AppBar>
      </SectionContent>
      <FormControlLabel
        control={(
          <Checkbox
            value="checkedB"
            color="primary"
            checked={graphs.visible}
            onChange={() => {
              setChangeMade(true);
              toggleGraph({ visible: !graphs.visible, open: graphs.open });
            }}
          />
        )}
        label="Show Panel"
      />
      {renderSaveBtn()}
      <FormControlLabel
        control={(
          <Checkbox
            value="checkedB"
            color="primary"
            checked={graphs.open}
            onChange={() => {
              setChangeMade(true);
              toggleGraph({ visible: graphs.visible, open: !graphs.open });
            }}
          />
        )}
        label="Panel Open"
      />
    </SectionBar>
  );
};
