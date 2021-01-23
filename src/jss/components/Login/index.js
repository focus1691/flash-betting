import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: 'theme.palette.common.white',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#FFB80C',
    borderRadius: '25px',
    border: '5px solid #000',
  },
  avatar: {
    margin: theme.spacing(1),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    margin: theme.spacing(5),
    padding: '25px',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default useStyles;
