import { makeStyles } from '@material-ui/core/styles';
import dropdownRunnerStyle from '../../../../DropdownList';
import row from '../../../../row';

const useStyles = makeStyles((theme) => ({
  ...row,
  button: {
    height: 'fit-content',
    borderRadius: theme.spacing(1),
    backgroundColor: '#242526',
    color: '#c7c2c2',
    fontFamily: 'Roboto',
  },
  textField: {
    width: '100%',
    margin: theme.spacing(1),
    '& label': {
      color: '#c7c2c2',
      fontWeight: '300',
      fontFamily: 'Roboto',
    },
    '& > div': {
      color: '#c7c2c2',
      fontWeight: '700',
      fontFamily: 'Roboto',
    },
    '& .MuiInputLabel-formControl': {
      position: 'relative',
    },
    '& .MuiInput-underline': {
      borderBottom: '2px solid #979797',
    },
  },
  formControlLabel: {
    '& span': {
      fontSize: 'small',
    },
  },
  marketTimeRadioButtons: {
    '& label': {
      color: '#c7c2c2',
      fontFamily: 'Roboto',
      fontWeight: '700',
      '& span:first-child': {
        '& span': {
          fontFamily: 'Roboto',
          fontWeight: '700',
          color: '#1074ff',
        },
      },
    },
  },
  ...dropdownRunnerStyle(theme),
}));

export default useStyles;
