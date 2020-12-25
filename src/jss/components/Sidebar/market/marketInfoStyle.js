import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  marketInfo: {
    fontFamily: 'Trebuchet MS, Arial, Helvetica, sans-serif',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
    border: 'none',
    width: '100%',
    height: 'auto',
    '& tr': {
      borderRadius: theme.spacing(1),
      '&:first-child': {
        '& td': {
          textAlign: 'center',
          borderRadius: theme.spacing(1),
          backgroundColor: '#242526',
          color: '#c7c2c2',
          fontFamily: 'Roboto',
          fontWeight: '400',
          fontSize: 'large',
        },
      },
      '&:nth-child(4n-1)': {
        background: '#565555',
      },
      '&:nth-child(4n-2)': {
        background: '#565555',
      },

      '&:nth-child(4n-3)': {
        background: '#494848',
      },
      '&:nth-child(4n-4)': {
        background: '#494848',
      },

      '&:nth-child(2n-1)': {
        fontWeight: 'normal',
        fontSize: 'small',
      },

      '&:nth-child(2n-2)': {
        fontWeight: 'bold',
        fontSize: 'medium',
      },

    },
    '& td': {
      padding: '5px',
    },
  },
}));

export default useStyles;
