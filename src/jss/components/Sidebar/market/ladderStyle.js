import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  ladder: {
    fontWeight: 'bold',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
    border: 'none',
    margin: '0 auto',
    width: '100%',
    height: 'auto',
    '& td': {
      '&:nth-child(1)': {
        width: '60%',
        fontSize: 'x-small',
      },
      '&:nth-child(n+2)': {
        width: '20%',
        fontSize: 'x-small',
      },
      '&:nth-child(2)': {
        background: '#FCB3C1',
      },
      '&:nth-child(4)': {
        background: '#90D2FB',
      },
    },
    '& tr': {
      '&:nth-child(n+1)': {
        '& td': {
          border: '1px solid #000',
          textAlign: 'center',
        }
      },
    },
    '& input[type=checkbox]': {
      border: '1px solid #333',
      content: "\\00a0",
      display: 'inline-block',
      font: '16px/1em sans-serif',
      height: '16px',
      margin: '0 .25em 0 0',
      padding: '0',
      verticalAlign: 'top',
      width: '16px',
    },
  },
}));

export default useStyles;
