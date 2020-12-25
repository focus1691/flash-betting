import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  clock: {
    '& span': {
      verticalAlign: 'super',
      paddingLeft: theme.spacing(1),
    },
  },
}));

export default useStyles;
