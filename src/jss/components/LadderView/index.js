import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  ladderContainer: {
    position: 'relative',
    height: '100%',
    overflowX: 'scroll',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    backgroundColor: '#121212',
  },
  suspendedMarket: {
    zIndex: '-1',
  }
}));

export default useStyles;
