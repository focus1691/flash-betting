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
      font: 'normal normal 900 small Roboto',
      background: 'transparent',
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
  stakeButton: {
    color: '#F5A623',
    border: '2px solid #F5A623',
  },
  liabilityButton: {
    color: '#D3D44F',
    border: '2px solid #D3D44F',
  },
  invalidInput: {
    borderColor: 'red',
  },
  gridImgContainer: {
    display: 'inline-block',
    height: '100%',
    verticalAlign: 'middle',
  },
  toggleBackLay: {
    cursor: 'pointer',
  },
  switch: {
    width: '24px',
    height: '24px',
    marginRight: theme.spacing(1),
  },
  switchStake: {
    transform: 'scaleX(1)',
  },
  switchLiability: {
    transform: 'scaleX(-1)',
  },
  submitBtn: {
    color: '#64D96A',
    font: 'normal normal bold large Roboto',
    border: '3px solid #64D96A',
    borderRadius: theme.spacing(3),
    padding: theme.spacing(0, 3),
    '&:hover': {
      color: '#19191A',
      backgroundColor: '#64D96A',
      boxShadow: '0px 0px 10px #00AC06',
    },
  },
}));

export default useStyles;
