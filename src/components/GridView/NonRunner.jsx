import React from 'react';
import { DeconstructRunner } from '../../utils/Market/DeconstructRunner';
import GridDetailSuspCell from './GridDetailSuspCell';
//* JSS
import useStyles from '../../jss/components/GridView/NonRunner';

export default ({
  sportId, nonRunners, runners, selectRunner,
}) => Object.keys(nonRunners).map((key) => {
  const classes = useStyles();
  const { name, number, logo } = DeconstructRunner(runners[key], sportId);
  return (
    <tr className={classes.gridNonRunner} key={`nonrunners-${key}`}>
      <GridDetailSuspCell
        sportId={sportId}
        name={name}
        number={number}
        logo={logo}
        onSelectRunner={selectRunner(runners[key])}
      />
      <td />
      <td />
      <td />
      <td />
      <td />
      <td />
      <td />
      <td />
      <td />
      <td />
    </tr>
  );
});
