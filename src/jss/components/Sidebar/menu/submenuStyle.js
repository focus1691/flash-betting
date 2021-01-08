import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  name: {
    '& span': {
      color: '#c7c2c2',
      fontWeight: '300',
      fontFamily: '"Roboto"',
    },
  },
}));

export default useStyles;
