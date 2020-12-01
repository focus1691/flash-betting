import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  gridRunnerDetails: {
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
        fontSize: 'small',
        fontWeight: 'normal',
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
}));

export default useStyles;
