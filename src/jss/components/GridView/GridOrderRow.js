import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  gridOrderRow: {
    backgroundColor: '#242526',
    padding: theme.spacing(1, 0),
    '& ul': {
      display: 'flex',
      justifyContent: 'space-evenly',
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
      margin: theme.spacing(0, 1),
      padding: theme.spacing(1, 1.5),
      cursor: 'pointer',
      '&:first-child': {
      },
    },
    '& img': {
      verticalAlign: 'middle',
    },
    '& input[type=text]': {

    },
    '& input[type=number]': {

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
