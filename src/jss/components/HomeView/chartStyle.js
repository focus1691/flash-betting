import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  chart: {
    width: '100%',
    height: '100%',
    flexBasis: '100%',
    backgroundColor: '#242526',
    borderRadius: theme.spacing(0, 2, 0, 0),
  },
}));

export default useStyles;
