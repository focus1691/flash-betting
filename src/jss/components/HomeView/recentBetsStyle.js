import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3, 2, 1, 2),
    height: '30vh',
  },
  sectionHeader: {
    font: 'normal normal bold xx-large Roboto',
    color: '#EEEEEE',
  },
  betTableContainer: {
    height: 'inherit',
    borderRadius: theme.spacing(2),
  },
  betTable: {
    '& thead': {
      backgroundColor: '#333F4B',
      boxShadow: '0px 6px 7px #00000029',
    },
    '& th': {
      color: '#F5A623',
      font: 'normal normal normal medium Roboto',
    },
    '& tbody': {
      backgroundColor: '#242526',
    },
    '& td': {
      color: '#FFFFFF',
      font: 'normal normal normal medium Roboto',
    },
  },
}));

export default useStyles;
