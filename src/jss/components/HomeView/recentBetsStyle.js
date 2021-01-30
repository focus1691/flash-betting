import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3, 0, 1, 2),
  },
  sectionHeader: {
    font: 'normal normal bold xx-large Roboto',
    color: '#EEEEEE',
  },
}));

export default useStyles;
