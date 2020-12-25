import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  header: {
    paddingBottom: theme.spacing(4),
    borderRadius: theme.spacing(0, 0, 4, 4),
    filter: 'drop-shadow(0px 6px 5px #333131)',
    backgroundColor: '#3a3b3c',
    '& p': {
      color: '#fff',
    },
    '& span': {
      color: '#fff',
    },
  },
  welcome: {
    display: 'flex',
    justifyContent: 'space-evenly',
    '& p': {
      color: '#f9f9f9',
      borderRadius: theme.spacing(4),
      padding: theme.spacing(2),
      filter: 'drop-shadow(0px 6px 5px rgba(45,44,44,0.5))',
      backgroundColor: '#242526',
      fontWeight: '700',
      fontFamily: '\'Open Sans\'',
      fontSize: 'x-large',
    },
  },
  account: {
    display: 'inline-block',
    borderRadius: theme.spacing(0, 4, 4, 0),
    padding: theme.spacing(2),
    filter: 'drop-shadow(-0.939px 5.926px 5px rgba(51,49,49,0.5))',
    backgroundColor: '#242526',
    '& p': {
      paddingLeft: theme.spacing(2),
      color: '#c7c2c2',
      fontWeight: '700',
      margin: '0 0 8px 21.33px',
      fontFamily: 'Roboto',
    },
    '& span': {
      paddingLeft: theme.spacing(1),
      color: '#c7c2c2',
      fontWeight: '400',
      fontFamily: 'Roboto',
    },
  },
  logoutButton: {
    padding: '0',
    border: 'none',
    background: 'none',
    float: 'right',
    cursor: 'pointer',
  },
}));

export default useStyles;
