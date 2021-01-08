import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  event: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    '& h6': {
      fontSize: 'medium',
    },
    '& div': {
      '&:first-child': {
        display: 'block',
        float: 'left',
        margin: theme.spacing(1),
        padding: theme.spacing(1, 2),
        borderRadius: theme.spacing(2),
        backgroundColor: '#5d5d5d80',
        color: '#c7c2c2',
        fontFamily: 'Roboto',
        fontSize: 'large',
        fontWeight: '700',
        '& span': {
          '&:nth-child(1)': {
            float: 'left',
          },
          '&:nth-child(2)': {
            float: 'left',
            clear: 'left',
          },
        },
      },
      '&:nth-child(2)': {
        display: 'flex',
        padding: theme.spacing(1, 2),
        '& span': {
          color: '#c7c2c2',
          fontFamily: '"Lato"',
          fontWeight: '400',
        },
        '& img': {
          marginRight: theme.spacing(1),
        },
      },
    },
  },
  eventTitle: {
    borderRadius: theme.spacing(0, 0, 2, 2),
    backgroundColor: '#7542eb',
    '& h6': {
      textAlign: 'center',
    },
  },
}));

export default useStyles;
