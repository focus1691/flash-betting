import { makeStyles } from '@material-ui/core/styles';
import dropdownRunnerStyle from '../../../../DropdownList';
import textFieldStyle from '../../../../textFieldStyle';
import radioButtonStyle from '../../../../radioButtonStyle';
import checkboxStyle from '../../../../checkboxStyle';
import row from '../../../../row';

const useStyles = makeStyles((theme) => ({
  ...row,
  textField: {
    width: '100%',
    margin: theme.spacing(1),
    ...textFieldStyle,
    '& > div': {
      color: '#c7c2c2',
      fontWeight: '700',
      fontFamily: 'Roboto',
    },
    '& .MuiInputLabel-formControl': {
      position: 'relative',
    },
  },
  checkboxes: {
    margin: theme.spacing(0, 1),
  },
  checkbox: {
    ...checkboxStyle,
  },
  unitRadioButtons: {
    ...radioButtonStyle,
  },
  ...dropdownRunnerStyle(theme),
}));

export default useStyles;
