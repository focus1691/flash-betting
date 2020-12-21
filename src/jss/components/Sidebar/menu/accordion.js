import { withStyles } from '@material-ui/core/styles';
import MultiAccordion from '@material-ui/core/Accordion';
import MultiAccordionSummary from '@material-ui/core/AccordionSummary';

export const Accordion = withStyles({
  root: {
    border: '1px solid #fff',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
      margin: 0,
    },
    backgroundColor: '#fff',
    color: 'orange',
    fontWeight: '900',
    fontSize: '0.8em',
    display: 'block',
  },
  expanded: {},
})(MultiAccordion);

export const AccordionSummary = withStyles({
  root: {
    zIndex: '1',
    '&$expanded': {
      minHeight: '0px',
    },
  },
  expanded: {
    minHeight: '0px',
  },
})(MultiAccordionSummary);
