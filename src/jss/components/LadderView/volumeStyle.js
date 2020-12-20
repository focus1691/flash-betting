import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  candleStick: {
    borderRight: '2px solid',
    backgroundColor: '#121212',
    position: 'relative',
    '& img': {
      display: 'block',
      position: 'absolute',
      right: '0',
      top: '0px',
    }
  },
  volumeCol: {
    position: 'absolute',
    height: '100%',
    background: 'rgba(235, 170, 109, 0.767)',
    color: '#fff',
    maxWidth: '100%',
    fontFamily: 'Lato',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    textAlign: 'left',
  },
}));

export default useStyles;
