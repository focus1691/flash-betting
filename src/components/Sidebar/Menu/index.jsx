import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { updateSubmenuList, updateMyMarketsSubmenu } from '../../../actions/sport';
import ActiveBets from './ActiveBets';
import AllSports from './AllSports';
import MyMarkets from './MyMarkets';
//* JSS
import SectionBar from '../../../jss/components/Sidebar/SectionBar';
import SectionContent from '../../../jss/components/Sidebar/SectionContent';
import useStyles from '../../../jss/components/Sidebar/menu';

const Menu = ({ updateSubmenuList, updateMyMarketsSubmenu }) => {
  const [expanded, setExpanded] = useState('my_markets');

  const classes = useStyles();

  const handleChange = (tab) => (event, newExpanded) => {
    if (expanded === tab && tab === 'all_sports') {
      updateSubmenuList({});
    } else if (expanded === tab && tab === 'my_markets') {
      updateMyMarketsSubmenu({});
      return;
    }
    setExpanded(newExpanded ? tab : false);
  };

  const createTitle = (name, position) => (
    <AppBar className={classes.appBar} position={position || 'absolute'}>
      <Typography variant="h6" className={classes.title}>
        {name}
      </Typography>
    </AppBar>
  );

  const createAccordionSummary = (name) => <SectionContent>{createTitle(name)}</SectionContent>;

  return (
    <>
      <SectionBar expanded={expanded === 'my_markets'} onChange={handleChange('my_markets')}>
        {createAccordionSummary('My Markets')}
        <MyMarkets />
      </SectionBar>

      <SectionBar expanded={expanded === 'all_sports'} onChange={handleChange('all_sports')}>
        {createAccordionSummary('All Sports')}
        <AllSports />
      </SectionBar>

      <SectionBar expanded={expanded === 'active_bets'} onChange={handleChange('active_bets')}>
        {createAccordionSummary('Active Bets')}
        <ActiveBets />
      </SectionBar>
    </>
  );
};

const mapDispatchToProps = {
  updateSubmenuList,
  updateMyMarketsSubmenu,
};

export default connect(null, mapDispatchToProps)(Menu);
