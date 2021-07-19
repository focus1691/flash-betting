import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#121212',
    padding: theme.spacing(2),
  },
  tables: {
    width: '100%',
    height: '62%',
    marginTop: '1.5%',
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}));

export default useStyles;
