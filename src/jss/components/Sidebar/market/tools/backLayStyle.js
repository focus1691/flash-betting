import { makeStyles } from '@material-ui/core/styles';
import dropdownRunnerStyle from '../../../../DropdownList';
import row from '../../../../row';

const useStyles = makeStyles((theme) => ({
  ...row,
  button: {
    margin: theme.spacing(2),
  },
  textField: {
    width: 40,
    margin: theme.spacing(1),
  },
  textField2: {
    width: 30,
    margin: theme.spacing(2),
  },
  ...dropdownRunnerStyle(theme),
}));

export default useStyles;
