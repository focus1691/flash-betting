import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: '#303030',
    color: 'orange',
    fontWeight: '900',
    border: '2px solid #fff',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
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
