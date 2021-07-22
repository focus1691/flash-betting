import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  graph: {
    width: '100%',
    height: '100%',
    margin: theme.spacing(1 / 2, 1),
    'user-drag': 'none',
    'user-select': 'none',
    '-moz-user-select': 'none',
    '-webkit-user-drag': 'none',
    '-webkit-user-select': 'none',
    '-ms-user-select': 'none',
  },
}));

export default useStyles;
