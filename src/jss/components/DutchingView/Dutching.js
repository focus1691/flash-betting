import { makeStyles } from '@material-ui/core/styles';
import scrollbar from '../../scrollbarStyle';

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative',
    height: '100%',
    ...scrollbar,
    overflowX: 'hidden',
    overflowY: 'scroll',
    whiteSpace: 'nowrap',
    backgroundColor: '#121212',
    fontFamily: 'Trebuchet MS, Arial, Helvetica, sans-serif',
    margin: '0 auto',
    textAlign: 'center',
  },
  runners: {
    '& p': {
      color: '#fff',
    },
  },
  calculations: {
    '& p': {
      color: '#fff',
    },
  },
  slider: {
    width: '75%',
  },
  button: {
    display: 'block',
    margin: '0 auto',
    backgroundColor: '#007AAF',
    boxShadow: '0px 6px 15px #0000005E',
    '& button': {
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: '#073C53',
      },
    },
  },
}));

export default useStyles;
