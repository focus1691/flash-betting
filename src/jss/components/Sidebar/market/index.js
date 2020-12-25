import { makeStyles } from '@material-ui/core/styles';
import headerStyle from '../headerStyle';
import buttonStyle from '../../../buttonStyle';

const useStyles = makeStyles((theme) => ({
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
  ladderContainer: {
    margin: theme.spacing(2, 0, 2, 0),
    padding: theme.spacing(2, 1),
    borderRadius: theme.spacing(2),
    backgroundImage: 'linear-gradient(171deg, #a5429c 0%, #6455ce 100%)',
    filter: 'drop-shadow(2px 4px 6px black)',
  },
}));

export default useStyles;
