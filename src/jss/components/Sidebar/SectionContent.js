import MultiAccordionSummary from '@material-ui/core/AccordionSummary';
import { withStyles } from '@material-ui/core/styles';

const SectionContent = withStyles((theme) => ({
  root: {
    margin: theme.spacing(0, 2),
    padding: '0',
    zIndex: '1',
    '&$expanded': {
      minHeight: '0px',
    },
  },
  expanded: {
    minHeight: '0px',
  },
}))(MultiAccordionSummary);

export default SectionContent;
