import { makeStyles } from '@material-ui/core/styles';
import headerStyle from '../headerStyle';
import textFieldStyle from '../../../textFieldStyle';
import scrollbar from '../../../scrollbarStyle';

const useStyles = makeStyles((theme) => ({
  settingsContainer: {
    ...scrollbar,
    overflowX: 'hidden',
    overflowY: 'scroll',
  },
  ...headerStyle,
  radioButtons: {
    margin: theme.spacing(1, 3),
    '& label': {
      color: '#c7c2c2',
      fontFamily: 'Roboto',
      fontWeight: '700',
      '& span': {
        fontFamily: 'Roboto',
        fontWeight: '700',
        '&:first-child': {
          color: '#1074ff',
        },
      },
    },
  },
  checkboxes: {
    margin: theme.spacing(0, 3),
    color: '#c7c2c2',
    fontFamily: 'Roboto',
    fontWeight: '700',
    '& span': {
      fontFamily: 'Roboto',
      fontWeight: '700',
      '&:first-child': {
        color: '#1074ff',
      },
    },
  },
  stakeButtons: {
    margin: theme.spacing(1, 1),
    ...textFieldStyle,
  },
  rightClickTicks: {
    margin: theme.spacing(0, 1),
  },
  textField: {
    width: 50,
    margin: theme.spacing(2),
  },
  saveBtn: {
    backgroundColor: 'Transparent',
    backgroundRepeat: 'no-repeat',
    border: 'none',
    padding: '5px',
    cursor: 'pointer',
    overflow: 'hidden',
    outline: 'none',
    float: 'right',
  },
}));

export default useStyles;
