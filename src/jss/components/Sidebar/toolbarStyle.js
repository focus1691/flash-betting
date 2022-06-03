import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderRadius: theme.spacing(2),
    backgroundColor: '#242526',
    marginTop: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    '& button': {
      flexBasis: 'calc(100% / 5)',
      width: '15px',
      border: '0',
      background: 'transparent',
      padding: theme.spacing(1, 0),
      '&:focus': {
        outline: 'none',
      },
      '& img': {
        width: '32px',
        height: '32px',
      },
      '&:nth-child(6) > img': {
        cursor: 'not-allowed',
      },
    },
  },
  marketClosed: {
    cursor: 'default !important',
  },
}));

export default useStyles;
