import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    backgroundColor: '#121212',
    padding: theme.spacing(2),
  },
  tables: {
    height: '70%',
    display: 'flex',
    margin: theme.spacing(2, 0),
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}));

export default useStyles;
