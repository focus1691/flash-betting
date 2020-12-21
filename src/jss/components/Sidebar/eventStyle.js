import { makeStyles } from '@material-ui/core/styles';
import headerStyle from './headerStyle';

const useStyles = makeStyles(() => ({
  ...headerStyle,
  event: {
    backgroundColor: '#b8c6db',
    backgroundImage: 'linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%)',
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
}));

export default useStyles;
