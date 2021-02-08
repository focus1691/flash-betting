import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    height: '30%',
  },
  title: {
    height: '20%',
    backgroundColor: '#26c281',
    color: 'white',
    paddingLeft: '1%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  marketReportContainer: {
    paddingLeft: '1%',
    display: 'flex',
    flexDirection: 'column',
    height: '80%',
    justifyContent: 'center',
    border: 'solid 2px #53dda4',
    borderTop: 'none',
    '& > div': {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  createdAt: {
    color: 'gray',
    fontWeight: '200',
  },
  marketName: {
    fontSize: '1.5em',
    marginBottom: '0.5rem',
    fontFamily: '"Open Sans"',
  },
  backButton: {
    marginTop: '2%',
    backgroundColor: '#26c281',
    width: 'max-content',
    padding: '0.75% 1%',
    textDecoration: 'none',
    color: 'white',
    cursor: 'pointer',
  },
}));

export default useStyles;
