import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    height: '55vh',
    padding: theme.spacing(0, 2),
  },
  menu: {
    flexBasis: '30%',
    backgroundColor: '#333F4B',
    borderRadius: theme.spacing(2, 0, 0, 0),
    overflowY: 'scroll',
  },
  menuItem: {
    color: '#EEEEEE',
    textAlign: 'center',
  },
  marketName: {
    '& span': {
      font: 'normal normal normal xx-large Roboto',
    },
  },
}));

export default useStyles;
