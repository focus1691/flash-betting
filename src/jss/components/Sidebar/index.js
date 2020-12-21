import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  sidebar: {
    width: '16.5rem',
    maxWidth: '100%',
    overflowX: 'hidden',

  },
  topSection: {
    position: 'sticky',
    top: '0',
    zIndex: '2',
    filter: 'drop-shadow(0px 6px 5px #333131)',
    backgroundColor: '#3a3b3c',
    marginBottom: theme.spacing(2),
  },
  toggleButton: {
    width: '33.33%',
  },
}));

export default useStyles;
