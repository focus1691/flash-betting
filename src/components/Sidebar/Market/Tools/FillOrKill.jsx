import React, { useEffect } from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
//* Actions
import { setDisplayText, setFillOrKill } from '../../../../actions/fillOrKill';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  number: {
    marginLeft: theme.spacing(1),
    width: 50,
  },
}));

const FillOrKill = ({ seconds, setDisplayText, setFillOrKill }) => {
  const classes = useStyles();

  useEffect(() => {
    setDisplayText(`${seconds} seconds`);
  }, [seconds, setDisplayText]);

  return (
    <>
      <div className={classes.root}>
        <TextField id="standard-number" className={classes.number} type="number" label="Seconds" value={seconds} inputProps={{ min: '1', max: '100' }} onChange={(e) => setFillOrKill(e.target.value)} margin="normal" />
      </div>
    </>
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
