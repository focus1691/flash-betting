import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  betsPlaced: {
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
    height: '90%',
  },
  tableContainer: {
    maxHeight: '55vh',
    overflowX: 'auto',
    height: '100%',
    border: 'solid 2px rgb(146, 164, 186)',
    borderTop: 'none',
  },
  title: {
    height: '6vh',
    backgroundColor: 'rgb(103, 128, 159)',
    color: 'white',
    paddingLeft: '2%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: '1.3em',
    fontWeight: 'bold',
  },
  betSide: {
    padding: '2px',
    paddingLeft: '4px',
    width: '20%',
    borderRadius: '2px',
    marginRight: '2%',
    display: 'inline-block',
    color: 'white',
  },
  backText: {
    backgroundColor: 'rgb(114, 187, 239)',
  },
  layText: {
    backgroundColor: 'rgb(250, 169, 186)',
  },
  betOutcome: {
    display: 'inline-block',
    minWidth: '40%',
    padding: '3px',
    borderRadius: '3px',
    textAlign: 'center',
    color: 'white',
  },
  betWin: {
    backgroundColor: 'rgb(37, 194, 129)',
  },
  betLose: {
    backgroundColor: 'rgb(237, 107, 117)',
  },
}));

export default useStyles;
