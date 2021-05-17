import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#424242',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    textAlign: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default useStyles;
