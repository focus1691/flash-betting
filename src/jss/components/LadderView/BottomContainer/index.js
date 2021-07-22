import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '22%',
    background: '#424242',
  },
  controls: {
    height: '15%',
    display: 'grid',
    gridTemplateRows: '100%',
    gridTemplateColumns: '15% 15% 15%',
    '& button': {
      borderRadius: '0',
      '&:first-child': {
        gridArea: '1/15',
      },
    },
  },
  controlBtn: {
    '& img': {
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
  },
  selected: {
    backgroundColor: '#565656',
  },
  graph: {
    height: '85%',
  },
}));

export default useStyles;
