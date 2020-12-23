import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  allSports: {
    borderCollapse: 'collapse',
    border: 'none',
    width: '90%',
    height: '40%',
    '& ul': {
        zIndex: '1',
    },
    '& span': {
      fontFamily: 'Roboto',
      fontWeight: '700',
    },
    '& li': {
      display: 'flex',
      flexDirection: 'row-reverse',
      color: '#c7c2c2',
      padding: theme.spacing(0, 2),
      marginLeft: '1rem',
      '& div': {
        '&:nth-child(2)': {
          padding: '0',
        },
      },
    },
  },
  activeBetName: {
    color: '#0000FF',
  },
}));

export default useStyles;
