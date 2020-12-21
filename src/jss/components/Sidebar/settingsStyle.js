import { makeStyles } from '@material-ui/core/styles';
import headerStyle from './headerStyle';

const useStyles = makeStyles((theme) => ({
  ...headerStyle,
  group: {
    margin: theme.spacing(1, 0),
  },
  textField: {
    width: 50,
    margin: theme.spacing(2),
  },
  saveBtn: {
    backgroundColor: 'Transparent',
    backgroundRepeat: 'no-repeat',
    border: 'none',
    padding: '5px',
    cursor: 'pointer',
    overflow: 'hidden',
    outline: 'none',
    float: 'right',
  },
}));

export default useStyles;
