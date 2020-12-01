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
  },
  activeBetName: {
    color: '#0000FF',
  },
  MuiTypography_body1: {
    fontSize: '0.8rem !important',
  },
}));

export default useStyles;
