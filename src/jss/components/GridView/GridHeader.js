import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  gridHeader: {
    backgroundColor: '#000000',
    backgroundImage: 'linear-gradient(315deg, #000000 0%, #414141 74%)',
    color: '#fff',
    '& h1': {
      display: 'block',
      fontSize: '1.4em',
      textAlign: 'center',
      fontWeight: 'bold',
    },
  },
  inPlay: {
    float: 'left',
    paddingBlockEnd: '5px',
    paddingInlineStart: '5px',
    '& span': {
      paddingRight: '5px',
    },
  },
  oneClickBtn: {
    float: 'right',
    backgroundColor: 'Transparent',
    backgroundRepeat: 'no-repeat',
    border: '2px solid #fff',
    color: '#fff',
    padding: '5px',
    '&:focus': {
      borderColor: 'red',
    },
  },
  oneClickStake: {
      '& button': {
        border: '2px solid #000',
        borderRadius: '8px',
        padding: '5px',
        margin: '5px',
        font: 'inherit',
        fontSize: '0.7em',
        fontWeight: 'bold',
        cursor: 'pointer',
        outline: 'inherit',
        '&:first-child': {
          width: '10%',
        },
        '&:not(:first-child)': {
          color: '#000',
          fontWeight: 'bold',
          backgroundRepeat: 'no-repeat',
          width: '6%',
        },
      }
  },
  matchedBets: {
    float: 'right',
    paddingInlineEnd: '5px',
  },
  gridSubheader: {
    borderCollapse: 'collapse',
    margin: '0',
    padding: '0',
    border: '0',
    borderSpacing: '0',
    '& th': {
      '&:nth-child(n+2)': {
        background: '#BCE4FC',
      },
      '&:nth-child(n+6)': {
        background: '#eba8a6',
      },
    },
  },
  marketCashout: {
    '& span': {
      '&:nth-child(2)': {
        cursor: 'pointer',
        fontSize: 'small',
        fontWeight: 'bold',
        float: 'right',
        lineHeight: '20px',
      },
    },
  },
}));

export default useStyles;
