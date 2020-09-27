import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../../actions/fillOrKill';

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

const FillOrKill = ({ seconds, onTextUpdate }) => {
  const classes = useStyles();

  React.useEffect(() => {
    onTextUpdate(`${seconds} seconds`);
  }, [seconds, onTextUpdate]);

  return (
    <>
      <div className={classes.root}>
        <TextField
          id="standard-number"
          className={classes.number}
          type="number"
          label="Seconds"
          value={seconds}
          inputProps={{ min: '1', max: '100' }}
          onChange={(e) => onReceiveFillOrKill(e.target.value)}
          margin="normal"
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  seconds: state.fillOrKill.seconds,
});

const mapDispatchToProps = (dispatch) => ({
  onTextUpdate: (text) => dispatch(actions.setDisplayText(text)),
  onReceiveFillOrKill: (seconds) => dispatch(actions.setFillOrKill(seconds)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FillOrKill);
