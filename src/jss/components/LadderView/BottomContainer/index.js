import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    height: '23%',
    background: '#424242',
    '& img': {
      width: '100%',
      height: '100%',
    },
  },
  controls: {
    height: '15%',
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  graph: {
    height: '85%',
  },
}));

export default useStyles;
