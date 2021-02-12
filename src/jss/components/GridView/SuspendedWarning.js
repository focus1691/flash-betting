import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  suspendedMessage: {
    margin: 'auto',
    width: '10%',
    position: 'fixed',
    top: '35%',
    left: '50%',
    border: '3px solid #B30011',
    padding: theme.spacing(2),
    textAlign: 'center',
    font: 'normal normal bold 1.25rem Roboto',
    color: '#B30011',
    cursor: 'pointer',
  },
}));

export default useStyles;
