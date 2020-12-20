import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  orderRow: {
    bottom: '0',
    height: '10%',
    background: '#424242',
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
      marginBottom: '2px',
      width: '100%',
      height: '100%',
      color: '#ffffff',
      backgroundColor: 'Transparent',
      backgroundRepeat: 'no-repeat',
      border: '0',
      borderRadius: theme.spacing(1),
      fontSize: 'small',
      fontWeight: '400',
      cursor: 'pointer',
      overflow: 'hidden',
      outline: 'none',
      '&:nth-child(1)': {
        backgroundImage: 'linear-gradient(180deg, #c2c0c2 0%, #262528 100%)',
      },
      '&:nth-child(2)': {
        backgroundImage: 'linear-gradient(180deg, #fdd911 0%, #262528 100%)',
      },
      '&:nth-child(3)': {
        backgroundImage: 'linear-gradient(180deg, #dc123d 0%, #262528 100%)',
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
