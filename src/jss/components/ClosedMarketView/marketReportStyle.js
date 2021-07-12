import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  marketReport: {
    width: '49%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: '1%',
    },
  },
  container: {
    width: '100%',
    height: '90%'
  },
  tableContainer: {
    overflowX: 'auto',
    height: '100%',
    background: '#242526',
    border: '2px solid #333F4B',
  },
  title: {
    backgroundColor: '#333F4B',
    boxShadow: '0px 6px 7px #00000029',
    color: '#EEEEEE',
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    font: 'normal normal bold 1.75rem Roboto',
    borderRadius: theme.spacing(1, 1, 0, 0),
  },
  marketOutcome: {
    display: 'inline-block',
    minWidth: '40%',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(3),
    textAlign: 'center',
    font: 'normal normal bold 0.8rem Roboto',
    color: '#EEEEEE',
    boxShadow: '6px 6px 25px #0000003D',
  },
  selectionWin: {
    backgroundColor: '#0BBF63',
  },
  selectionLose: {
    backgroundColor: '#BD2B32',
  },
  selectionPending: {
    backgroundColor: '#97979E',
  },
  selectionBetsProfit: {
    color: 'green',
  },
  selectionBetsLoss: {
    color: 'red',
  },
  hasBets: {
    fontWeight: 'bold',
  }
}));

export default useStyles;
