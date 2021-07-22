import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  orderRow: {
    bottom: '0',
    height: '85%',
    background: '#424242',
    display: 'block',
    width: '100%',
    float: 'left',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '& tr:first-of-type': {
      height: '100%', 
    },
    '& td': {
      width: '20%',
      margin: '0',
      padding: '0',
      '&:nth-child(1)': {
        width: '40%',
      },
      '&:nth-child(2)': {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexFlow: 'column-reverse',
        alignItems: 'center',
        justifyContent: 'center',
      },
      '&:nth-child(3)': {
        width: '40%',
      },
    },
    '& table': {
      height: '100%',
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
      display: 'flex',
      userSelect: 'none',
    },
    '& td': {
      width: '100vw !important',
      color: '#fff',
      fontFamily: "'Roboto'",
      fontSize: 'small',
      fontWeight: '400',
      textAlign: 'center',
      margin: theme.spacing(`calc(${theme.spacing(1)}px / 4)`, 1),
      borderRadius: theme.spacing(3),
      display: 'table-cell',
    },
  },
  orderBody: {
    height: '100%',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default useStyles;
