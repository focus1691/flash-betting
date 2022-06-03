import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    position: 'relative',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'scroll',
    whiteSpace: 'nowrap',
    backgroundColor: '#121212',
  },
  gridView: {
    fontFamily: 'Trebuchet MS, Arial, Helvetica, sans-serif',
    borderCollapse: 'collapse',
    border: 'none',
    width: '100%',
    '& td': {
      color: '#FFFFFF',
      textAlign: 'justify',
      fontWeight: 'bold',
      border: '2px solid #242526',
      padding: theme.spacing(2, 3),
      '&:first-child': {
        padding: theme.spacing(0.5),
      },
      '&:nth-child(6)': {
        backgroundColor: '#007AAF',
      },
      '&:nth-child(7)': {
        backgroundColor: '#D4696B',
      },
    },
    '& img': {
      float: 'left',
      width: '25px',
      height: '25px',
    },
  },
  gridCell: {
    cursor: 'pointer',
    backgroundColor: '#53606D',
    '&:hover': {
      backgroundColor: '#474f56',
      '&:nth-child(6)': {
        backgroundColor: '#0a5271',
      },
      '&:nth-child(7)': {
        backgroundColor: '#a44e50',
      },
    },
    '&:nth-child(2)': {
      backgroundColor: '#53606D',
      opacity: '0.5',
    },
    '&:nth-child(11)': {
      backgroundColor: '#53606D',
      opacity: '0.5',
    },
    '& span': {
      '&:nth-child(1)': {
        display: 'block',
        textAlign: 'center',
        fontSize: 'small',
        border: 'none',
      },
      '&:nth-child(2)': {
        display: 'block',
        clear: 'both',
        textAlign: 'center',
        fontSize: 'x-small',
        fontWeight: 'normal',
        border: 'none',
      },
    },
  },
  suspendedMarket: {
    zIndex: '-1',
  },
}));

export default useStyles;
