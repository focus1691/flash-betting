import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  header: {
    backgroundColor: '#000000',
    backgroundImage: 'linear-gradient(315deg, #000000 0%, #414141 74%)',
    padding: '5px',
    fontWeight: 'bold',
    '& p': {
      color: '#fff',
    },
    '& span': {
      color: '#fff',
    },
  },
  flag: {
    margin: '0',
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
