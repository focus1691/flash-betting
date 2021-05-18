import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  priceRow: {
    position: 'sticky',
    borderRadius: '15px',
    filter: 'drop-shadow(0px 4px 5px rgba(0,0,0,0.5))',
    bottom: '0',
    '& th': {
      position: 'sticky',
      bottom: '0',
      color: '#efecec',
      fontFamy: "'Lato'",
      fontSize: 'small',
      fontWeight: '700',
      userSelect: 'none',
      cursor: 'pointer',
      width: '11.5%',
      height: '3%',
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
