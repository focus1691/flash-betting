import React from 'react';
//* @material-ui core
import IconButton from '@material-ui/core/IconButton';
//* Components
import Graph from './graph';
//* JSS
import useStyles from '../../../jss/components/LadderView/BottomContainer';

const BottomPanel = ({ selectionId }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.controls}>
        <IconButton>
          <img src={`${window.location.origin}/icons/caret-arrow-up.png`} alt="" />
        </IconButton>
        <IconButton>
          <img src={`${window.location.origin}/icons/poker-chip.png`} alt="" />
        </IconButton>
        <IconButton>
          <img src={`${window.location.origin}/icons/increase.png`} alt="" />
        </IconButton>
      </div>
      <div className={classes.graph}>
        <Graph selectionId={selectionId} />
      </div>
    </div>
  );
};

export default BottomPanel;
