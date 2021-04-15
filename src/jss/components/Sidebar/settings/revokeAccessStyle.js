import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: theme.spacing(0, 2, 1, 2),
  },
  header: {
    backgroundColor: '#333F4B',
    boxShadow: '0px 6px 7px #00000029',
    borderRadius: theme.spacing(1, 1, 0, 0),
  },
  title: {
    color: '#EEEEEE',
    fontFamily: 'Roboto',
    fontSize: 'x-large',
    display: 'block',
    padding: theme.spacing(1, 0),
    fontWeight: '500',
  },
  body: {
    backgroundColor: '#19191A',
    boxShadow: '6px 6px 15px #00000057',
    borderRadius: theme.spacing(0, 0, 1, 1),
  },
  text: {
    color: '#D3D44F',
    fontFamily: 'Roboto',
    fontSize: 'large',
    display: 'block',
    padding: theme.spacing(1, 0),
  },
  buttons: {
    textAlign: 'center',
  },
  revokeBtn: {
    width: '75%',
    backgroundColor: '#972F31',
    color: '#EEEEEE',
    fontFamily: 'Roboto',
    fontSize: 'large',
    margin: theme.spacing(2, 0),
    border: '0',
    borderRadius: theme.spacing(1),
    cursor: 'pointer',
    outline: 'none',
  },
}));

export default useStyles;
