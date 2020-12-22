import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderRadius: theme.spacing(2),
    backgroundColor: '#242526',
    margin: theme.spacing(2, 0),
    '& button': {
      width: '20%',
      border: '0',
      background: 'transparent',
      padding: theme.spacing(2, 0),
    },
  },
}));

export default useStyles;
