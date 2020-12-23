import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderRadius: theme.spacing(2),
    backgroundColor: '#242526',
    margin: theme.spacing(2, 0),
    display: 'flex',
    alignItems: 'stretch',
    '& button': {
      flexBasis: '20%',
      width: '15px',
      border: '0',
      background: 'transparent',
      padding: theme.spacing(2, 0),
      '&:focus': {
        outline: 'none',
      },
    },
  },
}));

export default useStyles;
