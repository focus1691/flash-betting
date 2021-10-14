import { makeStyles } from '@material-ui/core/styles';
import userChip from './userChip';
import subscriptionChip from './subscriptionChip';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    height: '5%',
    padding: theme.spacing(3, 2, 1, 2),
    overFlowX: 'hidden',
  },
  statusChips: {
    width: '100%',
    maxWidth: '100%',
    display: 'flex',
    justifyContent: 'end',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'inline-block',
    },
  },
  sectionHeader: {
    font: 'normal normal bold xx-large Roboto',
    color: '#EEEEEE',
  },
  user: () => userChip(theme),
  subscription: ({ subscribed }) => subscriptionChip(theme, subscribed),
}));

export default useStyles;
