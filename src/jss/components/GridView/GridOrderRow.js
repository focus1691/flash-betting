import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  gridOrderRow: {
    margin: '0',
    fontSize: 'small',
    textAlign: 'center',
    '& li': {
      float: 'left',
      listStyleType: 'none',
      height: '100%',
      background: '#fff',
      border: '1px dashed',
      margin: '0 5px 0 0',
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
