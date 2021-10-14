import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    height: '55%',
    padding: theme.spacing(0, 2),
  },
  menu: {
    padding: '0',
    flexBasis: '25%',
    backgroundColor: '#333F4B',
    borderRadius: theme.spacing(2, 0, 0, 0),
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  menuItem: {
    color: '#EEEEEE',
    textAlign: 'center',
  },
  menuItemActive: {
    backgroundColor: '#242526',
    color: '#FBC774',
    textAlign: 'center',
  },
  marketName: {
    '& span': {
      fontSize: '1.5rem',
      fontFamily: 'Roboto',
      [theme.breakpoints.down('md')]: {
        fontSize: '1rem',
      },
    },
  },
}));

export default useStyles;
