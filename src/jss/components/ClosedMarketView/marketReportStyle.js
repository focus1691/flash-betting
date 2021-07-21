import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  marketReport: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginRight: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginTop: '1%',
    },
  },
  tableContainer: {
    width: 'auto',
    height: '100%',
    overflowX: 'auto',
    background: '#242526',
    border: '2px solid #333F4B',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  reportTable: {
    height: '100%',
    paddingBottom: theme.spacing(4),
    '& span': {
      fontFamily: 'Roboto',
      color: '#EEEEEE',
    }
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
    color: 'green !important',
  },
  selectionBetsLoss: {
    color: 'red !important',
  },
  hasBets: {
    fontWeight: 'bold',
  }
}));

export default useStyles;
