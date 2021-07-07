import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  ladder: {
    fontWeight: 'bold',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
    border: 'none',
    width: '100%',
    '& td': {
      color: '#fff',
      fontFamily: 'Roboto',
      fontSize: 'x-small',
      fontWeight: '700',
      '&:nth-child(1)': {
        width: '60%',
      },
      '&:nth-child(n+2)': {
        width: '20%',
      },
      '&:nth-child(2)': {
        background: '#d4696b',
      },
      '&:nth-child(4)': {
        background: '#0a5271',
      },
    },
    '& tr': {
      '&:nth-child(n+1)': {
        '& td': {
          textAlign: 'center',
        },
      },
      '&:first-child': {
        '& td': {
          '&:nth-child(2)': {
            borderRadius: theme.spacing(1, 0, 0, 0),
          },
          '&:nth-child(4)': {
            borderRadius: theme.spacing(0, 1, 0, 0),
          },
        },
      },
      '&:last-child': {
        '& td': {
          '&:nth-child(2)': {
            borderRadius: theme.spacing(0, 0, 0, 1),
          },
          '&:nth-child(4)': {
            borderRadius: theme.spacing(0, 0, 1, 0),
          },
        },
      },
    },
    '& input[type=checkbox]': {
      border: '1px solid #333',
      content: '\\00a0',
      display: 'inline-block',
      font: '16px/1em sans-serif',
      height: '16px',
      margin: '0 .25em 0 0',
      padding: '0',
      verticalAlign: 'top',
      width: '16px',
    },
  },
  ltp: {
    color: '#121212',
  },
  ltpEqual: {
    backgroundColor: '#d3d44f',
    color: '#121212',
  },
  // A higher odds value for last traded price is red = less likely to win
  ltpIncrease: {
    backgroundColor: '#BD2B32',
    color: '#d3d44f',
  },
  // A lower odds value for last traded price is green = more likely to win
  ltpDecrease: {
    backgroundColor: '#0BBF63',
    color: '#121212',
  },
}));

export default useStyles;
