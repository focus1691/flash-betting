import { makeStyles } from '@material-ui/core/styles';
import headerStyle from '../headerStyle';
import buttonStyle from '../../buttonStyle';

const useStyles = makeStyles(() => ({
  ...headerStyle,
  ...buttonStyle,
  appBarButton: {
    height: '22px',
    width: 'auto',
    display: 'inline-block',
    zIndex: '999',
    float: 'right',
    marginTop: '0.3em',
    '& img': {
      verticalAlign: 'bottom',
    },
  },
}));

export default useStyles;
