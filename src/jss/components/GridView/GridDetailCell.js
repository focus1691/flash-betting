import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  gridRunnerDetails: {
    backgroundColor: '#333F4B',
    padding: '2px',
    '& img': {
      cursor: `url(${window.location.origin}/icons/faq.png), auto`,
    },
    '& span': {
      '&:nth-child(2)': {
        float: 'left',
        marginLeft: '5px',
      },
      '&:nth-child(3)': {
        float: 'right',
      },
    },
  },
  gridPL: {
    clear: 'both',
    fontSize: 'small',
    textAlign: 'center',
    '& span': {
      '&:nth-child(1)': {
        cursor: 'pointer',
      },
      '&:nth-child(2)': {
        marginLeft: '10%',
      },
    },
  },
  ltp: {
    width: '20%',
    textAlign: 'center',
    borderRadius: theme.spacing(0.5),
    boxShadow: '0px 3px 6px #00000040',
    font: 'normal normal normal medium Roboto',
  },
}));

export default useStyles;
