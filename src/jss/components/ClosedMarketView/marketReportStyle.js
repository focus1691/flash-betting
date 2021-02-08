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
    maxHeight: '55vh',
    overflowX: 'auto',
    height: '100%',
    border: 'solid 2px #92a4ba',
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
  marketOutcome: {
    display: 'inline-block',
    minWidth: '40%',
    padding: '3px',
    borderRadius: '3px',
    textAlign: 'center',
    color: 'white',
  },
}));

export default useStyles;
