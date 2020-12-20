import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  ladderContainer: {
    position: 'relative',
    backgroundColor: '#121212',
    height: '100%',
    overflowX: 'scroll',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

export default useStyles;
