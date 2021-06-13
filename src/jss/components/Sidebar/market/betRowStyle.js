import { makeStyles } from '@material-ui/core/styles';
import buttonStyle from '../../../buttonStyle';

const useStyles = makeStyles(() => ({
  ...buttonStyle,
  betRow: {
    color: '#fff',
    '& td': {
      fontFamily: "'Roboto'",
      fontSize: 'small',
      fontWeight: '400',
      textAlign: 'center',
    },
  },
  cancelBetButton: {
    height: '100%',
    width: 'auto',
    '& img': {
      verticalAlign: 'bottom',
    },
    '& button': {
      backgroundColor: 'Transparent',
      backgroundRepeat: 'no-repeat',
      border: 'none',
      cursor: 'pointer',
      overflow: 'hidden',
      outline: 'none',
    },
  },
}));

export default useStyles;
