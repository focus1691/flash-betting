import { makeStyles } from '@material-ui/core/styles';
import row from '../../../../row';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  ...row,
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
  },
  backPriceTextFields: {
    width: 75,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  select: {
    margin: theme.spacing(1),
  },
}));

export default useStyles;
