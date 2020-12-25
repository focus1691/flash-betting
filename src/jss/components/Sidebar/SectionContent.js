import MultiAccordionSummary from '@material-ui/core/AccordionSummary';
import { withStyles } from '@material-ui/core/styles';

const SectionContent = withStyles({
  root: {
    margin: '0 7px',
    padding: '0',
    zIndex: '1',
    '&$expanded': {
      minHeight: '0px',
    },
  },
  expanded: {
    minHeight: '0px',
  },
})(MultiAccordionSummary);

export default SectionContent;
