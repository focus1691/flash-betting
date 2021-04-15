import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  gridHeader: {
    backgroundColor: '#19191A',
    backgroundImage: 'linear-gradient(90deg, #19191A 0%, #414141 74%)',
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
    border: '3px solid #64D96A',
    borderRadius: theme.spacing(1),
    color: '#0BBF63',
    font: 'normal normal bold medium Roboto',
    margin: theme.spacing(1, 1, 0, 0),
    padding: '5px',
    '&:focus': {
      borderColor: 'red',
    },
    '&:hover': {
      backgroundColor: '#64D96A',
      color: '#19191A',
      boxShadow: '0px 0px 10px #00AC06',
    },
  },
  oneClickButtons: {
    display: 'flex',
    justifyContent: 'center',
    '& button': {
      color: '#EEEEEE',
      border: '2px solid #EEEEEE',
      borderRadius: theme.spacing(3),
      boxShadow: '6px 6px 15px #00000045',
      font: 'normal normal 900 large Roboto',
      padding: '5px',
      margin: '5px',
      fontSize: '0.7em',
      fontWeight: 'bold',
      cursor: 'pointer',
      outline: 'inherit',
      '&:first-child': {
        flexBasis: '10%',
      },
      '&:not(:first-child)': {
        flexBasis: '6%',
      },
    },
  },
  oneClickStake: {
    backgroundColor: '#007AAF',
    boxShadow: '0px 6px 15px #0000005E',
    '& button': {
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: '#073C53',
      },
    },
  },
  oneClickLiability: {
    backgroundColor: '#D4696B',
    boxShadow: '0px 6px 15px #0000005E',
    '& button': {
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: '#BD2B32',
      },
    },
  },
  oneClickStakeSelected: {
    backgroundColor: '#045B81 !important',
  },
  oneClickLiabilitySelected: {
    backgroundColor: '#C94A4F !important',
  },
  matchedBets: {
    float: 'right',
    paddingInlineEnd: '5px',
  },
  gridSubheader: {
    '& th': {
      '&:nth-child(n+2)': {
        background: '#007aaf',
      },
      '&:nth-child(n+6)': {
        background: '#D4696B',
      },
    },
  },
  headerText: {
    color: '#EEEEEE',
  },
  marketCashout: {
    backgroundColor: '#3A3B3C',
    color: '#EEEEEE',
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
