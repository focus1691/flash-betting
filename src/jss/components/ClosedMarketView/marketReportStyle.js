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
    padding: '3px',
    borderRadius: '3px',
    textAlign: 'center',
    color: 'white',
  },
  selectionWin: {
    backgroundColor: 'rgb(37, 194, 129)',
  },
  selectionLose: {
    backgroundColor: 'rgb(237, 107, 117)',
  },
}));

export default useStyles;
