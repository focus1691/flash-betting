import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  sidebar: {
    width: '16.5rem',
    maxWidth: '100%',
    overflowX: 'hidden',
    backgroundColor: '#424242',

  },
  topSection: {
    position: 'sticky',
    top: '0',
    zIndex: '2',
    filter: 'drop-shadow(0px 6px 5px #333131)',
    backgroundColor: '#3a3b3c',
    marginBottom: theme.spacing(2),
  },
  menuButtons: {
    margin: theme.spacing(1, 1, 0, 1),
    filter: 'drop-shadow(0px 6px 5px rgba(45,44,44,0.5))',
    backgroundColor: '#242526',
  },
  toggleButton: {
    width: '33.33%',
  },
}));

export default useStyles;
