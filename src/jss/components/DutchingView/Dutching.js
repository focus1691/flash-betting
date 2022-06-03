import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'scroll',
    whiteSpace: 'nowrap',
    backgroundColor: '#121212',
    fontFamily: 'Trebuchet MS, Arial, Helvetica, sans-serif',
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
}));

export default useStyles;
