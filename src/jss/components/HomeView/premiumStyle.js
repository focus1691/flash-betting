import { makeStyles } from '@material-ui/core/styles';
import userChip from './userChip';
import subscriptionChip from './subscriptionChip';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundImage: `url(${window.location.origin}/images/digital_world_map_hologram_blue_background.png)`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  backgroundFilter: {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    opacity: '0.5',
    background: '#333F4B 0% 0% no-repeat padding-box',
    zIndex: '1',
  },
  title: {
    color: '#EEEEEE',
    textAlign: 'center',
    font: 'normal normal bold 4rem Roboto',
    zIndex: '2',
  },
  subtitle: {
    color: '#EEEEEE',
    textAlign: 'center',
    font: 'normal normal bold 3.75rem Roboto',
    zIndex: '2',
  },
  statusChips: {
    textAlign: 'center',
    zIndex: '2',
  },
  user: () => userChip(theme),
  subscription: ({ subscribed }) => subscriptionChip(theme, subscribed),
  subscriptionList: {
    display: 'flex',
    flexBasis: '60%',
    justifyContent: 'space-evenly',
    zIndex: '2',
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
    boxShadow: '10px 10px 50px #000000B3',
    border: '6px solid #BD2B32',
    borderRadius: theme.spacing(3),
    height: '30rem',
    zIndex: '2',
    '& hr': {
      width: '90%',
      height: '4px',
      backgroundColor: '#EEEEEE',
    },
  },
  subscriptionBackground: {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    background: '#333F4B 0% 0% no-repeat padding-box',
    boxShadow: '10px 10px 50px #000000B3',
    filter: 'blur(6px) brightness(0.5)',
    borderRadius: theme.spacing(2),
    opacity: '0.8',
    zIndex: '1',
  },
  subscriptionHeader: {
    width: '100%',
    padding: '5% 0',
    borderRadius: '10px 10px 0 0',
    textAlign: 'center',
    fontWeight: '500',
    font: 'normal normal bold 3.5rem Roboto',
    color: '#0BBF63',
    zIndex: '2',
  },
  subscriptionPrice: {
    width: '100%',
    padding: '5% 0 0 0',
    marginTop: '10%',
    marginBottom: '0',
    textAlign: 'center',
    font: 'normal normal bold 3.75rem Roboto',
    color: '#EEEEEE',
    zIndex: '2',
  },
  subscriptionPeriod: {
    width: '100%',
    marginTop: '1%',
    textAlign: 'center',
    fontFamily: 'Open Sans',
    font: 'normal normal normal 2rem Roboto',
    color: '#34495e',
    zIndex: '2',
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
    zIndex: '2',
    '&:hover': {
      border: 'none',
    },
  },
}));

export default useStyles;
