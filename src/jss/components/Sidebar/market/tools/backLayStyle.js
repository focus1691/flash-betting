import { makeStyles } from '@material-ui/core/styles';
import dropdownRunnerStyle from '../../../../DropdownList';
import textFieldStyle from '../../../../textFieldStyle';
import radioButtonStyle from '../../../../radioButtonStyle';
import submitButtonStyle from '../../../../submitButtonStyle';
import row from '../../../../row';

const useStyles = makeStyles((theme) => ({
  ...row,
  button: {
    borderRadius: theme.spacing(1),
    ...submitButtonStyle,
  },
  textField: {
    width: '100%',
    margin: theme.spacing(1),
    '& > div': {
      color: '#c7c2c2',
      fontWeight: '700',
      fontFamily: 'Roboto',
    },
    '& .MuiInputLabel-formControl': {
      position: 'relative',
    },
    ...textFieldStyle,
  },
  formControlLabel: {
    '& span': {
      fontSize: 'small',
    },
  },
  marketTimeRadioButtons: {
    ...radioButtonStyle,
  },
  ...dropdownRunnerStyle(theme),
}));

export default useStyles;
