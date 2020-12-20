import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  priceRow: {
    position: 'sticky',
    borderRadius: '15px',
    filter: 'drop-shadow(0px 4px 5px rgba(0,0,0,0.5))',
    backgroundImage: 'linear-gradient(167deg, #43464b 0%, #616569 100%)',
    bottom: '0',
    '& th': {
      position: 'sticky',
      bottom: '0',
      color: '#fff',
      fontSize: 'small',
      background: 'transparent',
      userSelect: 'none',
      // -moz-user-select: none;
      // -webkit-user-select: none;
      cursor: 'pointer',
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
