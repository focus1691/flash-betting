import MultiAccordion from '@material-ui/core/Accordion';
import { withStyles } from '@material-ui/core/styles';

const SectionBar = withStyles({
  root: {
    backgroundColor: '#424242',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
      margin: 0,
    },
  },
  expanded: {},
})(MultiAccordion);

export default SectionBar;
