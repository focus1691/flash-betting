import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    height: '5%',
    padding: theme.spacing(3, 2, 1, 2),
  },
  statusChips: {
    width: '100%',
    textAlign: 'end',
  },
  sectionHeader: {
    font: 'normal normal bold xx-large Roboto',
    color: '#EEEEEE',
  },
  username: {
    background: '#D3D44F',
    color: '#121212',
    font: 'normal normal bold medium Roboto',
    padding: theme.spacing(1),
  },
  subscription: ({ subscribed }) => ({
    background: subscribed ? '#0BBF63' : '#F44336',
    color: '#121212',
    font: 'normal normal bold medium Roboto',
    marginLeft: theme.spacing(1),
    padding: theme.spacing(2, 1),
  }),
}));

export default useStyles;
