import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  gridOrderRow: {
    backgroundColor: '#242526',
    padding: theme.spacing(1, 0),
    '& ul': {
      margin: '0',
      fontSize: 'small',
      textAlign: 'center',
    },
    '& li': {
      float: 'left',
      listStyleType: 'none',
      height: '100%',
      color: '#D3D44F',
      background: 'transparent',
      border: '2px solid #D3D44F',
      borderRadius: theme.spacing(4),
      margin: theme.spacing(0, 2),
      width: '5%',
      cursor: 'pointer',
      '&:first-child': {
        width: '10%',
      },
    },
    '& img': {
      verticalAlign: 'middle',
    },
    '& input[type=text]': {
      width: '6%',
    },
    '& input[type=number]': {
      width: '6%',
    },
  },
  gridImgContainer: {
    display: 'inline-block',
    height: '100%',
    verticalAlign: 'middle',
  },
  toggleBackLay: {
    cursor: 'pointer',
  },
}));

export default useStyles;
