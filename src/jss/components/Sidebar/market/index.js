import { makeStyles } from '@material-ui/core/styles';
import headerStyle from '../headerStyle';
import buttonStyle from '../../../buttonStyle';

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: '#242526',
    color: '#c7c2c2',
    fontWeight: '700',
    borderRadius: theme.spacing(1),
    zIndex: '1',
  },
  title: {
    textAlign: 'center',
    fontSize: '1.1rem',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
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
