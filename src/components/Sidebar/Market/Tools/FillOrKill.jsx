import React, { useEffect } from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import TextField from '@material-ui/core/TextField';
//* JSS
import useStyles from '../../../../jss/components/Sidebar/market/tools/fillOrKillStyle';
//* Actions
import { setDisplayText, setFillOrKill } from '../../../../actions/fillOrKill';

const FillOrKill = ({ seconds, setDisplayText, setFillOrKill }) => {
  const classes = useStyles();

  useEffect(() => {
    setDisplayText(`${seconds} seconds`);
  }, [seconds, setDisplayText]);

  return (
    <div className={classes.row}>
      <TextField id="standard-number" className={classes.number} type="number" label="Seconds" value={seconds} inputProps={{ min: '1', max: '100' }} onChange={(e) => setFillOrKill(e.target.value)} margin="normal" />
    </div>
  );
};

const mapStateToProps = (state) => ({
  seconds: state.fillOrKill.seconds,
});

const mapDispatchToProps = {
  setDisplayText,
  setFillOrKill,
};

export default connect(mapStateToProps, mapDispatchToProps)(FillOrKill);
