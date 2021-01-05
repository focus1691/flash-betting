import React, { useEffect } from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
//* JSS
import useStyles from '../../../../jss/components/Sidebar/market/tools/tickOffsetStyle';
//* Actions
import { setDisplayText, setTicks, setUnit, setPercentTrigger, setHedged } from '../../../../actions/tickOffset';

const TickOffset = ({ ticks, unit, percentTrigger, hedged, setDisplayText, setTicks, setUnit, setPercentTrigger, setHedged }) => {
  const classes = useStyles();

  useEffect(() => {
    const unitSymbol = unit === 'Percent' ? '%' : unit;
    const percent = `(${percentTrigger}%)`;

    setDisplayText(`${ticks} ${unitSymbol} ${percent} [${hedged ? 'x' : '-'}]`);
  }, [ticks, unit, percentTrigger, hedged, setDisplayText]);

  return (
    <>
      <div className={classes.row}>
        <TextField id="standard-number" type="number" label="Ticks" className={classes.textField} value={ticks} inputProps={{ min: '1', max: '100' }} onChange={(e) => setTicks(e.target.value)} margin="normal" />
        <RadioGroup name="tickoffset" value={unit} onChange={(e) => setUnit(e.target.value)}>
          <FormControlLabel className={classes.formControlLabel} value="Ticks" control={<Radio color="primary" />} label="Ticks" />
          <FormControlLabel value="Percent" control={<Radio color="primary" />} label="%" />
        </RadioGroup>
      </div>
      <div className={classes.row}>
        <TextField id="standard-number" className={classes.textField} type="number" label="% Trigger" value={percentTrigger} inputProps={{ min: '1', max: '100' }} onChange={(e) => setPercentTrigger(e.target.value)} margin="normal" />
        <FormControlLabel control={<Checkbox color="primary" checked={hedged} onChange={(e) => setHedged(e.target.checked)} />} label="Hedged" />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  ticks: state.tickOffset.ticks,
  unit: state.tickOffset.units,
  percentTrigger: state.tickOffset.percentTrigger,
  hedged: state.tickOffset.hedged,
});

const mapDispatchToProps = {
  setDisplayText,
  setTicks,
  setUnit,
  setPercentTrigger,
  setHedged,
};

export default connect(mapStateToProps, mapDispatchToProps)(TickOffset);
