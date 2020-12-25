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
    margin: theme.spacing(1, 3),
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
      color: '#1074ff',
    },
    '& label': {
      color: '#c7c2c2',
      fontFamily: 'Roboto',
      fontWeight: '400',
    },
    '& div': {
      '& input[type=number]': {
        color: '#c7c2c2',
        fontFamily: 'Roboto',
        fontWeight: '700',
      },
      '&:before': {
        borderBottom: '1px solid #979797',
      },
      '&:after': {
        borderBottom: '1px solid #1074ff',
      },
    },
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
