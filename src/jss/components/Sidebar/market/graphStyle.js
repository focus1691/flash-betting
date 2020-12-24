import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  graph: {
    margin: theme.spacing(2),
    '& img': {
      width: '100%',
      borderRadius: theme.spacing(3),
    },
  },
}));

export default useStyles;
