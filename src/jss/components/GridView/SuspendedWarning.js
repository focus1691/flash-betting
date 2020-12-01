import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  suspendedMessage: {
    margin: 'auto',
    width: '10%',
    position: 'absolute',
    top: '25%',
    left: '33.3%',
    border: '3px solid #B30011',
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 'small',
    color: '#B30011',
    cursor: 'pointer',
  },
}));

export default useStyles;
