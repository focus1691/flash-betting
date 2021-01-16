import { makeStyles } from '@material-ui/core/styles';
import headerStyle from './headerStyle';

const useStyles = makeStyles((theme) => ({
  ...headerStyle,
  radioButtons: {
    margin: theme.spacing(1, 3),
    '& label': {
      color: '#c7c2c2',
      fontFamily: 'Roboto',
      fontWeight: '700',
      '& span': {
        fontFamily: 'Roboto',
        fontWeight: '700',
        '&:first-child': {
          color: '#1074ff',
        },
      },
    },
  },
  checkboxes: {
    margin: theme.spacing(0, 3),
    color: '#c7c2c2',
    fontFamily: 'Roboto',
    fontWeight: '700',
    '& span': {
      fontFamily: 'Roboto',
      fontWeight: '700',
      '&:first-child': {
        color: '#1074ff',
      },
    },
  },
  stakeButtons: {
    margin: theme.spacing(1, 1),
    '& .Mui-focused': {
      color: '#B7F5BA',
      fontWeight: '700',
    },
    '& .MuiInput-underline:after': {
      borderBottom: '2px solid #B7F5BA',
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: '1px solid #e6f2e6',
    },
    '& label': {
      color: '#c7c2c2',
      fontFamily: 'Roboto',
      fontWeight: '400',
    },
    '& > div': {
      '& input[type=number]': {
        color: '#c7c2c2',
        fontFamily: 'Roboto',
        fontWeight: '700',
      },
    },
  },
  rightClickTicks: {
    margin: theme.spacing(0, 1),
  },
  textField: {
    width: 50,
    margin: theme.spacing(2),
  },
  saveBtn: {
    backgroundColor: 'Transparent',
    backgroundRepeat: 'no-repeat',
    border: 'none',
    padding: '5px',
    cursor: 'pointer',
    overflow: 'hidden',
    outline: 'none',
    float: 'right',
  },
}));

export default useStyles;
