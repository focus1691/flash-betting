import { makeStyles } from '@material-ui/core/styles';
import userChip from './userChip';
import subscriptionChip from './subscriptionChip';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  title: {
    color: '#EEEEEE',
    textAlign: 'center',
    font: 'normal normal bold 4rem Roboto',
  },
  subtitle: {
    color: '#EEEEEE',
    textAlign: 'center',
    font: 'normal normal bold 3.75rem Roboto',
  },
  statusChips: {
    textAlign: 'center',
  },
  user: () => userChip(theme),
  subscription: ({ subscribed }) => subscriptionChip(theme, subscribed),
  subscriptionList: {
    display: 'flex',
    flexBasis: '60%',
    justifyContent: 'space-evenly',
    '& div:nth-child(1)': {
      '& > div': {
        color: '#0BBF63',
      },
      '& p ~ p': {
        color: '#0BBF63',
      },
      '& button:hover': {
        backgroundColor: '#0BBF63',
        boxShadow: '6px 6px 15px #0000004D',
      },
    },
    '& div:nth-child(2)': {
      '& > div': {
        color: '#D3D44F',
      },
      '& p ~ p': {
        color: '#D3D44F',
      },
      '& button:hover': {
        backgroundColor: '#AEAF00',
        boxShadow: '6px 6px 15px #0000004D',
      },
    },
    '& div:nth-child(3)': {
      '& > div': {
        color: '#F5A623',
      },
      '& p ~ p': {
        color: '#F5A623',
      },
      '& button:hover': {
        backgroundColor: '#F5A623',
        boxShadow: '6px 6px 15px #0000004D',
      },
    },
  },
  subscriptionContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    flexBasis: '30%',
    backgroundColor: '#333F4B',
    boxShadow: '10px 10px 50px #000000B3',
    border: '6px solid #BD2B32',
    borderRadius: theme.spacing(3),
    height: '30rem',
    '& hr': {
      width: '90%',
      height: '4px',
      backgroundColor: '#EEEEEE',
    },
  },
  subscriptionHeader: {
    width: '100%',
    padding: '5% 0',
    borderRadius: '10px 10px 0 0',
    textAlign: 'center',
    fontWeight: '500',
    font: 'normal normal bold 3.5rem Roboto',
    color: '#0BBF63',
  },
  subscriptionPrice: {
    width: '100%',
    padding: '5% 0 0 0',
    marginTop: '10%',
    marginBottom: '0',
    textAlign: 'center',
    font: 'normal normal bold 3.75rem Roboto',
    color: '#EEEEEE',
  },
  subscriptionPeriod: {
    width: '100%',
    marginTop: '1%',
    textAlign: 'center',
    fontFamily: 'Open Sans',
    font: 'normal normal normal 2rem Roboto',
    color: '#34495e',
  },
  subscriptionButton: {
    position: 'absolute',
    bottom: '0',
    width: '75%',
    marginBottom: '3rem',
    border: '3px solid #BD2B32',
    borderRadius: theme.spacing(3),
    color: '#EEEEEE',
    font: 'normal normal normal x-large Segoe',
    '&:hover': {
      border: 'none',
    },
  },
}));

export default useStyles;
