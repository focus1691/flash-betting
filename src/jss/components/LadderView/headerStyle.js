import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  ladderHeader: {
    fontFamily: 'Lato',
    display: 'flex !important',
    flexDirection: 'row',
    borderRadius: theme.spacing(0, 0, 3, 3),
    backgroundColor: '#242526',
    width: '100%',
    height: '8%',
    '& > div': {
      '&:nth-child(1)': {
        marginLeft: '2%',
        width: '70%',
      },
      '&:nth-child(2)': {
        width: '30%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1ae17d',
        fontWeight: 'bold',
        textAlign: 'left',
      }
    },
  },
  runnerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  runnerName: {
    fontSize: '0.9em',
    textAlign: 'left',
    color: '#efecec',
    fontFamily: 'Lato',
    userSelect: 'none',
    cursor: 'move',
  },
  runnerDetails: {
    color: '#efecec',
    fontSize: 'x-small',
    fontWeight: '400',
    padding: '0 5px',
  },
  runnerIcon: {
    verticalAlign: 'middle',
    cursor: `url(${window.location.origin}/icons/faq.png), auto`,
    backgroundColor: '#fff',
    marginRight: '3px',
    padding: '3px',
    borderRadius: theme.spacing(2),
  },
  runnerodds: {
    color: '#1ae17d',
    fontWeight: '700',
    display: 'block',
    userSelect: 'none',
    width: '50%',
  },
}));

export default useStyles;
