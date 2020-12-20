import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  gridContainer: {
    position: 'relative',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'scroll',
    whiteSpace: 'nowrap',
  },
  gridView: {
    fontFamily: 'Trebuchet MS, Arial, Helvetica, sans-serif',
    borderCollapse: 'collapse',
    border: 'none',
    width: '75%',
    '& td': {
      width: '35px',
      textAlign: 'justify',
      fontWeight: 'bold',
      border: '1px solid #D6D6D6',
      padding: '5px',
      '&:nth-child(5)': {
        borderRight: '1px solid #a6a6a6',
      },
      '&:nth-child(6)': {
        backgroundColor: '#007aaf',
        border: '1px solid #a6a6a6',
      },
      '&:nth-child(7)': {
        backgroundColor: '#eba8a6',
        border: '1px solid #a6a6a6',
      },
    },
    '& img': {
      float: 'left',
    },
  },
  gridCell: {
    cursor: 'pointer',
    '&:hover': {
      background: '#DFDFDF',
      '&:nth-child(6)': {
        background: '#0a5271',
      },
      '&:nth-child(7)': {
        background: '#d4696b',
      },
    },
    '&:nth-child(2)': {
      opacity: '0.5',
    },
    '&:nth-child(11)': {
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
