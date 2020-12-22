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
    margin: theme.spacing(2, 0, 0, 0),
    filter: 'drop-shadow(0px 6px 5px rgba(45,44,44,0.5))',
    '& button': {
      padding: theme.spacing(2, 0),
      '&:nth-child(1)': {
        borderRadius: theme.spacing(3, 0, 0, 3),
      },
      '&:nth-child(3)': {
        borderRadius: theme.spacing(0, 3, 3, 0),
      },
    },
  },
  toggleButton: {
    width: '33.33%',
    '& img': {
      width: '15px',
      paddingRight: '3px',
    },
  },
}));

export default useStyles;
