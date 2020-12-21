import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  graph: {
    background: '#fff',
    border: '1px solid',
    padding: '10px',
    '& img': {
      '&:nth-child(2)': { width: '400px', height: '300px' },
    },
    '& span': {
      fontSize: 'small',
      fontWeight: 'bold',
    },
  },
  toggleButton: {
    textAlign: 'center',
    background: 'none!important',
    border: 'none',
    padding: '0!important',
    marginLeft: '10%',
    fontFamily: 'arial, sans-serif',
    color: '#069',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  closeButton: {
    float: 'right',
    cursor: 'pointer',
  },
}));

export default useStyles;
