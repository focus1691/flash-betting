import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    height: '55%',
    padding: theme.spacing(0, 2),
  },
  menu: {
    display: 'inline-table',
    position: 'absolute',
    width: '15%',
    height: 'inherit',
    zIndex: '3',
    padding: '0',
    backgroundColor: '#333F4B',
    borderRadius: theme.spacing(2, 0, 0, 0),
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
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
