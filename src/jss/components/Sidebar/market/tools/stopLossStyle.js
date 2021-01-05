import { makeStyles } from '@material-ui/core/styles';
import row from '../../../../row';

const useStyles = makeStyles((theme) => ({
  ...row,
  root: {
    width: '100%',
    height: '50px',
    backgroundColor: theme.palette.background.paper,
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
    marginRight: theme.spacing(2),
    width: 50,
  },
}));

export default useStyles;
