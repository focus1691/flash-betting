import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  ladderHeader: {
    display: 'flex !important',
    flexDirection: 'row',
    borderRadius: theme.spacing(0, 0, 3, 3),
    backgroundColor: '#242526',
    width: '100%',
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
        color: 'rgb(106, 177, 79)',
        fontWeight: 'bold',
        textAlign: 'left',
      }
    },
  },
  runnerContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  runnerName: {
    fontSize: '0.9em',
    textAlign: 'left',
    color: '#efecec',
    fontFamily: 'Lato',
    userSelect: 'none',
    // -moz-user-select: none;
    // -webkit-user-select: none;
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
  },
  runnerodds: {
    color: 'rgb(106, 177, 79)',
    fontWeight: 'bold',
    display: 'block',
    userSelect: 'none',
    // -moz-user-select: none;
    // -webkit-user-select: none;
    width: '50%',
  },
}));

export default useStyles;
