import { makeStyles } from '@material-ui/core/styles';
import buttonStyle from '../../buttonStyle';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    height: '4%',
    width: '100vw',
    backgroundColor: '#b0151c',
    padding: theme.spacing(1, 0),
    zIndex: '999',
    textAlign: 'center',
    color: '#f9f9f9',
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    font: 'normal normal bold large Roboto',
  },
  resubscribeBtn: {
    ...buttonStyle.button,
    font: 'normal normal normal large Roboto',
    color: '#f9f9f9',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(2.5),
    borderWidth: '2px',
    borderStyle: 'solid',
    borderLeftWidth: '0px',
    borderRightWidth: '0px',
    '&:hover': {
      borderLeftWidth: theme.spacing(2),
      borderRightWidth: theme.spacing(2),
    },
  },
}));

export default useStyles;