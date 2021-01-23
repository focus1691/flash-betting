import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: 'theme.palette.common.white',
    },
  },
  box: {
    width: '100%',
    backgroundImage: `url(${window.location.origin}/images/digital_world_map_hologram_blue_background.png)`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    background: 'green',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  logo: {
    flexBasis: '35%',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  login: {
    display: 'flex',
    flexBasis: '35%',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#333F4B 0% 0% no-repeat padding-box',
    borderRadius: '25px',
    border: '6px solid #BD2B32',
  },
  avatar: {
    margin: theme.spacing(1),
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    margin: theme.spacing(5),
    padding: '25px',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default useStyles;
