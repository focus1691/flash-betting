import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  allSports: {
    fontFamily: '"Trebuchet MS", Arial, Helvetica, sans-serif',
    borderCollapse: 'collapse',
    border: 'none',
    width: '90%',
    height: '40%',
    '& tr': {
        color: '#0000FF',
    },
    '& ul': {
        zIndex: '1',
    },
    '& span': {
        fontSize: '0.8rem !important',
    },
  },
  activeBetName: {
    color: '#0000FF',
  },
}));

export default useStyles;
