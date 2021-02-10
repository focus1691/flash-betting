import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '30%',
  },
  title: {
    backgroundColor: '#333F4B',
    boxShadow: '0px 6px 7px #00000029',
    color: '#EEEEEE',
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    font: 'normal normal bold 1.75rem Roboto',
    borderRadius: theme.spacing(1, 1, 0, 0),
  },
  marketReportContainer: {
    backgroundColor: '#242526',
    boxShadow: '6px 6px 15px #00000057',
    paddingLeft: '1%',
    display: 'flex',
    flexDirection: 'column',
    height: '80%',
    justifyContent: 'flex-start',
    borderRadius: theme.spacing(0, 0, 1, 1),
    '& > div': {
      display: 'flex',
      flexDirection: 'column',
      '& > p': {
        marginBlockEnd: '0.3em',
      },
    },
  },
  createdAt: {
    font: 'normal normal normal 1.25rem Roboto',
    color: '#64D96A',
  },
  marketName: {
    font: 'normal normal normal 1.45rem Roboto',
    color: '#D3D44F',
  },
  backButton: {
    marginTop: '2%',
    boxShadow: '6px 6px 25px #00000069',
    border: '4px solid #D4696B',
    borderRadius: theme.spacing(4),
    width: 'max-content',
    padding: theme.spacing(1, 4),
    textDecoration: 'none',
    font: 'normal normal bold 1.25rem Roboto',
    color: '#EBA8A6',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#D4696B',
      color: '#EEEEEE',
    },
  },
}));

export default useStyles;
