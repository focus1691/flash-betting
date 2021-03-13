import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  menuBets: {
    fontFamily: '"Trebuchet MS", Arial, Helvetica, sans-serif',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
    border: 'none',
    margin: '0 auto',
    width: '100%',
    height: 'auto',
  },
  button: {
    height: '22px',
    width: 'auto',
    backgroundColor: 'transparent',
    visibility: 'collapse',
    pointerEvents: 'none',
  },
  heading: {
    background: '#ff6600',
    '& > td': {
      fontFamily: "'Roboto'",
      fontSize: 'medium',
      fontWeight: '700',
      textAlign: 'center',
    },
  },
  event: {
    width: '400%',
    background: '#6f6f1f',
    color: 'white',
  },
  selection: {
    width: '400%',
    background: 'rgb(0, 111, 223)',
    color: 'rgb(223, 223, 0)',
    '& > td': {
      padding: '2px',
    },
  },
  matchedBet: {
    '& td': {
      fontFamily: "'Roboto'",
      fontSize: 'small',
      fontWeight: '400',
      textAlign: 'center',
    },
  },
  profitLoss: {
    fontWeight: 'bold',
  },
  profit: {
    color: '#85ff85',
  },
  loss: {
    color: '#ea5b5b',
  },
  neutral: {
    color: 'black',
  },
}));

export default useStyles;
