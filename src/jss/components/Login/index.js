import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  box: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundImage: `url(${window.location.origin}/images/digital_world_map_hologram_blue_background.png)`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  background: {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    opacity: '0.5',
    background: '#242526 0% 0% no-repeat padding-box',
    zIndex: '1',
  },
  login: {
    position: 'relative',
    display: 'flex',
    flexBasis: '35%',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(1, 4),
    borderRadius: theme.spacing(2),
    border: '6px solid #BD2B32',
    zIndex: '2',
  },
  loginBackground: {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    background: '#333F4B 0% 0% no-repeat padding-box',
    boxShadow: '10px 10px 50px #000000B3',
    filter: 'blur(6px) brightness(0.6)',
    borderRadius: theme.spacing(2),
    opacity: '0.8',
    zIndex: '1',
  },
  logo: {
    flexBasis: '45%',
    maxWidth: '100%',
    maxHeight: '100%',
    zIndex: '2',
  },
  titleText: {
    color: '#EEEEEE',
    font: 'normal normal bold xx-large Segoe',
    margin: theme.spacing(2, 0, 0.5, 0),
    zIndex: '2',
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexFlow: 'wrap',
    width: '100%',
    padding: '25px',
    zIndex: '2',
  },
  loginTextField: {
    width: '80%',
    margin: theme.spacing(3, 0),
    '& label': {
      font: 'normal normal normal large Segoe',
      color: '#F5A623',
      zIndex: '3',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -20px) scale(0.75)',
      },
      '&.Mui-focused': {
        color: '#64D96A',
      },
    },
    '& fieldset': {
      '&.MuiOutlinedInput-notchedOutline': {
        borderColor: '#0BBF63 !important',
      },
    },
  },
  loginInput: {
    font: 'normal normal normal x-large Segoe',
    color: '#0BBF63',
    backgroundColor: '#0D1C1E',
    borderRadius: theme.spacing(3),
    zIndex: '2',
  },
  welcomeText: {
    textAlign: 'center',
    color: '#F5A623',
    font: 'normal normal normal large Segoe',
    zIndex: '2',
  },
  helpText: {
    textAlign: 'center',
    margin: theme.spacing(2, 0),
    width: '100%',
    color: '#F5A623',
    font: 'normal normal normal large Segoe',
    zIndex: '2',
  },
  registerLink: {
    color: '#64D96A',
    textAlign: 'left',
    font: 'normal normal normal large Segoe',
    marginLeft: theme.spacing(1),
  },
  submit: {
    display: 'contents',
    textAlign: 'center',
    '& button': {
      width: '40%',
      margin: theme.spacing(3, 0, 2, 0),
      background: 'transparent',
      border: `${theme.spacing(1) / 2}px solid #BD2B32`,
      borderRadius: theme.spacing(3),
      zIndex: '2',
      '& span': {
        color: '#EEEEEE',
        font: 'normal normal normal large Segoe',
      },
      '&:hover': {
        background: '#BD2B32 0% 0% no-repeat padding-box',
        boxShadow: '6px 6px 15px #0000004D',
      },
    },
  },
}));

export default useStyles;
