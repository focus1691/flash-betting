import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  name: {
    '& span': {
      color: '#c7c2c2',
      fontWeight: '700',
      fontFamily: '"Roboto"',
    },
  },
  dropdownIcon: {
    display: 'contents',
    '& img': {
      marginRight: theme.spacing(1),
    },
  },
}));

export default useStyles;
