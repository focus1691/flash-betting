import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    height: '43%',
    padding: theme.spacing(0, 2),
  },
  menu: {
    flexBasis: '35%',
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
      font: 'normal normal normal x-large Roboto',
    },
  },
}));

export default useStyles;
