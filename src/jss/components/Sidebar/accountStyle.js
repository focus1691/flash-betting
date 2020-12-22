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
