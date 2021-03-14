import { makeStyles } from '@material-ui/core/styles';
import dropdownRunnerStyle from '../../../../DropdownList';
import textFieldStyle from '../../../../textFieldStyle';
import submitButtonStyle from '../../../../submitButtonStyle';
import row from '../../../../row';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  ...row,
  button: {
    borderRadius: theme.spacing(1),
    ...submitButtonStyle,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 75,
  },
  group: {
    margin: theme.spacing(1, 0),
  },
  formControlLabel: {
    fontSize: '0.6rem',
    '& label': {
      fontSize: '0.6rem',
    },
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    ...textFieldStyle,
  },
  backPriceTextFields: {
    width: 75,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    ...textFieldStyle,
  },
  select: {
    margin: theme.spacing(1),
  },
  ...dropdownRunnerStyle(theme),
}));

export default useStyles;
