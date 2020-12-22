import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  event: {
    '& h6': {
      fontSize: 'medium',
    },
    '& > div': {
      padding: '5px',
      '& span': {
        '&:nth-child(1)': {
          float: 'left',
        },
        '&:nth-child(2)': {
          float: 'left',
          clear: 'left',
        },
      },
      '& > div': {
        color: '#fff',
        margin: '5px',
        display: 'block',
        float: 'left',
        border: '1px solid',
        borderRadius: '10px',
        padding: '5px',
        fontSize: 'large',
        fontWeight: 'bold',
      },
    },
  },
  eventTitle: {
    borderRadius: theme.spacing(0, 0, 2, 2),
    backgroundColor: '#7542eb',
    '& h6': {
      textAlign: 'center',
    },
  },
}));

export default useStyles;
