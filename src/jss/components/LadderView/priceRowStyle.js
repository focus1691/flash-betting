import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  priceRow: {
    position: 'sticky',
    bottom: '0',
    '& th': {
      position: 'sticky',
      bottom: '0',
      backgroundColor: 'white',
      outline: '1px solid rgb(178, 181, 181)',
      userSelect: 'none',
      // -moz-user-select: none;
      // -webkit-user-select: none;
      cursor: 'pointer',
      fontSize: 'small',
      width: '11.5%',
      '& input': {
        width: '100%',
      },
      '&:first-child': {
        width: '19.5%',
      },
    },
  },
}));

export default useStyles;
