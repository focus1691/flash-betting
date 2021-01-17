import { makeStyles } from '@material-ui/core/styles';
import textFieldStyle from '../../../../textFieldStyle';
import radioButtonStyle from '../../../../radioButtonStyle';
import checkboxStyle from '../../../../checkboxStyle';
import row from '../../../../row';

const useStyles = makeStyles((theme) => ({
  ...row,
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(5),
    width: 75,
    ...textFieldStyle,
  },
  unitRadioButtons: {
    ...radioButtonStyle,
  },
  checkbox: {
    ...checkboxStyle,
  },
}));

export default useStyles;
