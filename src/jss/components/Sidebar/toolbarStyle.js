import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(0.5),
  },
  toolbar: {
    borderRadius: theme.spacing(2),
    backgroundColor: '#242526',
    marginTop: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    '& button': {
      flexBasis: 'calc(100% / 4)',
      width: '15px',
      border: '0',
      background: 'transparent',
      padding: theme.spacing(1, 0),
      '&:focus': {
        outline: 'none',
      },
      '& img': {
        width: '32px',
        height: '100%',
      },
      '&:nth-child(6)': {
        cursor: 'default',
      },
      '&:nth-child(6) img': {
        cursor: 'not-allowed',
      },
    },
  },
  marketClosed: {
    cursor: 'default !important',
  },
}));

export default useStyles;
