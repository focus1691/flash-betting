import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { updateCurrentSubmenu, updateSubmenuList, updateSubmenuListMyMarkets, updateSubmenuMyMarkets } from '../../../actions/sport';
import ActiveBets from './ActiveBets';
import AllSports from './AllSports';
import MyMarkets from './MyMarkets';
//* JSS
import { Accordion, AccordionSummary } from '../../../jss/components/Sidebar/menu/accordion';
import useStyles from '../../../jss/components/Sidebar/menu';

const Menu = ({ updateCurrentSubmenu, updateSubmenuList, updateSubmenuMyMarkets, updateSubmenuListMyMarkets }) => {
  const [expanded, setExpanded] = useState('my_markets');

  const classes = useStyles();

  const handleChange = (tab) => (event, newExpanded) => {
    if (expanded === tab && tab === 'all_sports') {
      updateCurrentSubmenu('');
      updateSubmenuList({});
    } else if (expanded === tab && tab === 'my_markets') {
      updateSubmenuMyMarkets('');
      updateSubmenuListMyMarkets({});
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

  const createAccordionSummary = (name) => (
    <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
      {createTitle(name)}
    </AccordionSummary>
  );

  return (
    <>
      <Accordion expanded={expanded === 'my_markets'} onChange={handleChange('my_markets')}>
        {createAccordionSummary('My Markets')}
        <MyMarkets />
      </Accordion>

      <Accordion expanded={expanded === 'all_sports'} onChange={handleChange('all_sports')}>
        {createAccordionSummary('All Sports')}
        <AllSports />
      </Accordion>

      <Accordion expanded={expanded === 'active_bets'} onChange={handleChange('active_bets')}>
        {createAccordionSummary('Active Bets')}
        <ActiveBets />
      </Accordion>
    </>
  );
};

const mapDispatchToProps = {
  updateCurrentSubmenu,
  updateSubmenuList,
  updateSubmenuMyMarkets,
  updateSubmenuListMyMarkets,
};

export default connect(null, mapDispatchToProps)(Menu);
