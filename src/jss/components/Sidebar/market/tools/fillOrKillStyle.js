import { makeStyles } from '@material-ui/core/styles';
import textFieldStyle from '../../../../textFieldStyle';
import row from '../../../../row';

const useStyles = makeStyles((theme) => ({
  ...row,
  number: {
    marginLeft: theme.spacing(1),
    width: 50,
    ...textFieldStyle,
  },
}));

export default useStyles;
