import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    height: '22%',
    background: '#424242',
    '& img': {
      width: '100%',
      height: '100%',
    },
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
  selected: {
    backgroundColor: '#565656',
  },
  graph: {
    height: '85%',
  },
}));

export default useStyles;
