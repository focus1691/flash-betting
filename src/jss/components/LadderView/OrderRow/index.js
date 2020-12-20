import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  orderRow: {
    bottom: '0',
    height: '10%',
    background: '#fff',
    display: 'block',
    width: '100%',
    float: 'left',
    '& td': {
      width: '20%',
      margin: '0',
      padding: '0',
      '&:nth-child(1)': {
        width: '40%',
      },
      '&:nth-child(2)': {
        display: 'block',
        width: '100%',
      },
      '&:nth-child(3)': {
        width: '40%',
      },
    },
    '& table': {
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
      border: '1px solid',
      position: 'relative',
      margin: '0 auto',
      padding: '0',
    },
    '& button': {
      position: 'sticky',
      display: 'block',
      width: '100%',
      height: '100%',
      backgroundColor: 'Transparent',
      backgroundRepeat: 'no-repeat',
      border: '1px solid',
      cursor: 'pointer',
      overflow: 'hidden',
      outline: 'none',
      '&:nth-child(1)': {
        background: 'silver',
      },
      '&:nth-child(2)': {
        background: 'gold',
      },
      '&:nth-child(3)': {
        background: 'crimson',
      },
    },
  },
  orderTable: {
    border: 'unset !important',
    width: '100%',
    borderSpacing: '0',
    borderCollapse: 'collapse',
    whiteSpace: 'nowrap',
    overflowY: 'scroll',
    '& tr': {
      borderBottom: '1px solid #fff',
      userSelect: 'none',
      // -moz-user-select: none;
      // -webkit-user-select: none;
      '&:nth-child(1)': {
        width: '30px%',
      },
      '&:nth-child(odd)': {
        width: '100%',
        background: '#eba8a6',
      },
    },
    '& td': {
      width: '100vw !important',
      fontSize: 'x-small',
      textAlign: 'center',
      overflow: 'scroll',
    },
  },
  orderBody: {
    overflowY: 'scroll',
    display: 'block',
    minHeight: '3.5em',
    maxHeight: '3.5em',
  },
}));

export default useStyles;
