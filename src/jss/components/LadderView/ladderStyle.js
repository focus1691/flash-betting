import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  ladder: {
    position: 'relative',
    width: '100%',
    overflowY: 'hidden',
    overflowX: 'hidden',
    height: '75%',
    '& th': {
      position: 'sticky',
      top: '0',
      padding: '0',
    },
  },
  List: {
    fontFamily: 'roboto, Arial, Helvetica, sans-serif',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
    border: '1px solid rgb(178, 181, 181)',
    width: '100%',
    boxSizing: 'content-box',
    '& > div': {
      height: '7014px !important',
    },
    '& .tr': {
      display: 'flex',
    },
    '& .td': {
      fontSize: 'x-small',
      textAlign: 'right',
      userSelect: 'none',
      // -moz-user-select: none;
      // -webkit-user-select: none;
      width: '12.5%',
      '&:nth-child(1)': {
        width: '100%',
      },
      '&:nth-child(2)': {
        backgroundColor: '#525f6c',
      },
      '&:nth-child(3)': {
        color: '#fff',
        backgroundColor: '#eba8a6',
      },
      '&:nth-child(4)': {
        color: '#fff',
        fontWeight: '900',
      },
      '&:nth-child(5)': {
        color: '#fff',
        backgroundColor: '#007aaf',
      },
      '&:nth-child(6)': {
        backgroundColor: '#525f6c',
      },
      '&:not(:first-child)': {
        textAlign: 'center',
        fontSize: 'small',
        fontFamily: 'roboto',
        // border: '1px solid #000000',
        borderBottom: '1px solid #ecdede',
        padding: '2px',
        cursor: 'pointer',
        width: '30%',
        overflow: 'hidden',
      },
    },
  },
}));

export default useStyles;
