import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  priceRow: {
    position: 'sticky',
    background: 'transparent linear-gradient(103deg, #43464B 0%, #616569 100%) 0% 0% no-repeat padding-box',
    boxShadow: '0px 4px 10px #00000080',
    borderRadius: '10px 10px 15px 15px',
    height: '3%',
    bottom: '0',
    '& th': {
      position: 'sticky',
      bottom: '0',
      color: '#efecec',
      fontFamily: "'Lato'",
      fontSize: 'small',
      userSelect: 'none',
      cursor: 'pointer',
      width: '11.5%',
      '& input': {
        width: '100%',
        '-webkit-appearance': 'none',
        outline: 'none',
        border: 'none',
        padding: '0',
        fontFamily: "'Lato'",
        fontSize: 'small',
        marginLeft: theme.spacing(1 / 2),
      },
      '&:first-child': {
        width: '19.5%',
      },
    },
  },
  priceSelected: {
    background: '#121212 0% 0% no-repeat padding-box',
    borderRadius: theme.spacing(1),
  },
}));

export default useStyles;
