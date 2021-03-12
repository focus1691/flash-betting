import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  allSports: {
    borderCollapse: 'collapse',
    border: 'none',
    width: '90%',
    height: '40%',
    '& > div': {
      background: 'none',
      '&:first-child': {
        width: 'fit-content',
      },
    },
    '& ul': {
      zIndex: '1',
    },
    '& li': {
      display: 'flex',
      flexDirection: 'row',
      color: '#c7c2c2',
      padding: theme.spacing(0, 0),
      marginLeft: '1rem',
      '& div': {
        '&:nth-child(2)': {
          padding: '0',
        },
      },
    },
  },
  activeBetName: {
    '& span': {
      color: '#c7c2c2',
      fontWeight: '700',
      fontFamily: '"Roboto"',
    },
  },
}));

export default useStyles;
