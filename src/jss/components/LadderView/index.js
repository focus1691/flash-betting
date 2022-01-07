import { makeStyles } from '@material-ui/core/styles';
import scrollbar from '../../scrollbarStyle';

const useStyles = makeStyles(() => ({
  ladderContainer: {
    position: 'relative',
    height: '100%',
    overflowX: 'scroll',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    backgroundColor: '#121212',
    ...scrollbar,
  },
  suspendedMarket: {
    zIndex: '-1',
  },
  closedContainer: {
    position: 'relative',
    height: '100%',
    backgroundColor: '#121212',
  },
}));

export default useStyles;
