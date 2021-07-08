import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderRadius: theme.spacing(2),
    backgroundColor: '#242526',
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'stretch',
    '& button': {
      flexBasis: 'calc(100% / 6)',
      width: '15px',
      border: '0',
      background: 'transparent',
      padding: theme.spacing(2, 0),
      '&:focus': {
        outline: 'none',
      },
      '&:nth-child(6) > img': {
        width: '32px',
        height: '32px',
        cursor: 'not-allowed',
      },
    },
  },
}));

export default useStyles;
