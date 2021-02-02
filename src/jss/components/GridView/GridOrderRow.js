import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  gridOrderRow: {
    backgroundColor: '#242526',
    padding: theme.spacing(1, 0),
    '& ul': {
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      margin: '0',
      textAlign: 'center',
    },
    '& li': {
      float: 'left',
      listStyleType: 'none',
      height: '100%',
      color: '#F5A623',
      font: 'normal normal 900 small Roboto',
      background: 'transparent',
      border: '2px solid #F5A623',
      borderRadius: '50%',
      margin: theme.spacing(0, 1),
      padding: theme.spacing(1, 1.5),
      cursor: 'pointer',
      '&:first-child': {
        font: 'normal normal bold medium Roboto',
        border: 'none',
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
