import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
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
    width: '75%',
    '& td': {
      color: '#FFFFFF',
      width: '35px',
      textAlign: 'justify',
      fontWeight: 'bold',
      border: '2px solid #242526',
      padding: '5px',
      '&:nth-child(5)': {
        borderRight: '1px solid #a6a6a6',
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
      backgroundColor: '#333940',
      opacity: '0.5',
    },
    '& span': {
      '&:nth-child(1)': {
        width: '100%',
        float: 'left',
        textAlign: 'center',
        fontSize: 'small',
      },
      '&:nth-child(2)': {
        width: '100%',
        float: 'left',
        clear: 'both',
        textAlign: 'center',
        fontSize: 'x-small',
        fontWeight: 'normal',
      },
    },
  },
}));

export default useStyles;
