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
    border: '1px solid',
    margin: '0 auto',
    width: '100%',
    '& tr': {
      border: '1px solid',
    },
    '& td': {
      fontSize: 'x-small',
      fontWeight: 'bold',
      margin: '0',
      padding: '5px',
      border: 'none',
      '&:nth-child(2)': {
        borderLeft: '1px solid',
      },
      '&:first-child': {
        fontSize: 'x-small',
      },
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
      fontSize: 'x-small',
      marginLeft: '2px',
    },
  },
}));

export default useStyles;
