import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  timescaleButtons: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    top: '0',
    right: '5%',
    zIndex: '3',
    '& label': {
      color: '#B6CCF9',
      fontFamily: 'Roboto',
      fontWeight: '700',
      '& span': {
        fontFamily: 'Roboto',
        fontWeight: '700',
        '&:first-child': {
          color: '#B6CCF9',
        },
      },
    },
  },
  chart: {
    width: '100%',
    height: '100%',
    flexBasis: '100%',
    backgroundColor: '#242526',
  },
}));

export default useStyles;
