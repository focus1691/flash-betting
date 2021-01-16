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
  container: {
    padding: theme.spacing(0 , 2),
  },
  ladderBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(171deg, #a5429c 0%, #6455ce 100%)',
    opacity: 0.2,
  },
  ladderContainer: {
    padding: theme.spacing(2, 1),
    borderRadius: theme.spacing(2),
    filter: 'drop-shadow(2px 4px 6px black)',
  },
}));

export default useStyles;
