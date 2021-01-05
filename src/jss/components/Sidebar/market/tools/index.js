import { makeStyles } from '@material-ui/core/styles';
import box from '../../box';

const useStyles = makeStyles((theme) => ({
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
      margin: '0 auto',
      '&:nth-child(2)': {
        borderLeft: '2px solid #242526',
        paddingLeft: theme.spacing(1),
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
      color: '#c7c2c2',
      fontSize: 'small',
      fontFamily: 'Roboto',
      fontWeight: '400',
      marginLeft: '2px',
    },
  },
}));

export default useStyles;
