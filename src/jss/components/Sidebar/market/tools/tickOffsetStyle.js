import { makeStyles } from '@material-ui/core/styles';
import row from '../../../../row';

const useStyles = makeStyles((theme) => ({
  ...row,
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(5),
    width: 75,
  },
}));

export default useStyles;
