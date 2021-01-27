import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  subscriptionList: {
    display: 'flex',
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'space-between',
    alignSelf: 'center',
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
  subscriptionContainer: {
    width: '20rem', 
    height: '25rem',
    background: 'rgb(235, 235, 235)',
    borderRadius: '10px',
    marginTop: '7.5%',
    boxShadow: '1px 1px 20px 0px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
  },
  subscriptionHeader: {
    width: '100%',
    padding: '5% 0',
    background: 'rgb(82, 94, 100)',
    borderRadius: '10px 10px 0 0',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: '1.5rem',
    fontFamily: 'Open Sans',
    color: 'white',
  },
  subscriptionPrice: {
    width: '100%',
    padding: '5% 0 0 0',
    marginTop: '10%',
    marginBottom: '0',
    textAlign: 'center',
    fontSize: '4rem',
    fontFamily: 'Open Sans',
    color: '#34495e',
  },
  subscriptionText: {
    width: '100%',
    marginTop: '1%',
    textAlign: 'center',
    fontSize: '1rem',
    fontFamily: 'Open Sans',
    color: '#34495e',
  },
  subscriptionButton: {
    marginTop: '10%',
    padding: '3.5% 5%',
    maxWidth: '31%',
    textAlign: 'center',
    fontSize: '1rem',
    fontFamily: 'Open Sans',
    alignSelf: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  greyButton: {
    border: '1px solid #525e64',
    color: '#525e64',
    '&:hover': {
      borderColor: 'transparent',
      color: 'white',
      animation: '$subscriptionGreyFocus .3s ease-in-out',
    },
  },
  greenButton: {
    border: 'unset',
    background: '#26C281',
    color: 'white',
    fontWeight: '600',
    '&:hover': {
      borderColor: 'transparent',
      color: 'white',
      animation: '$subscriptionGreenFocus .3s ease-in-out',
    },
  },
  "@keyframes subscriptionGreyFocus": {
    "0%": {
      backgroundColor: 'transparent',
      border: '1px solid #525e64',
      color: '#525e64',
    },
    "100%": {
      backgroundColor: '#525e64',
      borderColor: 'transparent',
      color: 'white',
    },
  },
  "@keyframes subscriptionGreenFocus": {
    "0%": {
      backgroundColor: '#26C281',
    },
    "100%": {
      backgroundColor: '#1e9765',
    },
  }
}));

export default useStyles;
