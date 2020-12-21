import { makeStyles } from '@material-ui/core/styles';
import buttonStyle from '../../../buttonStyle';

const useStyles = makeStyles(() => ({
  ...buttonStyle,
  betRow: {
    '& td': {
      fontSize: 'small',
    },
  },
  cancelBetButton: {
    height: '22px',
    width: 'auto',
    '& img': {
      verticalAlign: 'bottom',
    },
  },
}));

export default useStyles;
