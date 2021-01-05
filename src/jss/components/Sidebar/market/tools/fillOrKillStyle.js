import { makeStyles } from '@material-ui/core/styles';
import row from '../../../../row';

const useStyles = makeStyles((theme) => ({
  ...row,
  number: {
    marginLeft: theme.spacing(1),
    width: 50,
  },
}));

export default useStyles;
