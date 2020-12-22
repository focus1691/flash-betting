import { makeStyles } from '@material-ui/core/styles';
import box from '../../box';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  ...box,
  table: {
    padding: '0',
    tableLayout: 'fixed',
    margin: '0 auto',
    width: '100%',
    '& td': {
      fontFamily: 'Roboto',
      fontSize: 'x-small',
      fontWeight: 'bold',
      margin: '0',
      padding: '5px',
      border: 'none',
    },
  },
  betButton: {
    backgroundColor: 'Transparent',
    backgroundRepeat: 'no-repeat',
    border: 'none',
    margin: '0',
    padding: '0',
    cursor: 'pointer',
    outline: 'none',
    float: 'left',
    '& span': {
      color: '#c7c2c2',
      fontFamily: 'Roboto',
      fontSize: 'x-small',
      marginLeft: '2px',
    },
  },
}));

export default useStyles;
