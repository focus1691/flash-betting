import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  marketInfo: {
    fontFamily: 'Trebuchet MS, Arial, Helvetica, sans-serif',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
    border: 'none',
    margin: '0 auto',
    width: '100%',
    height: 'auto',
    '& tr': {
      '&:first-child': {
        '& td': {
          backgroundColor: '#ffffff',
          backgroundImage: 'linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%)',
          fontSize: 'large',
          fontWeight: 'bold',
        },
      },
      '&:nth-child(4n-1)': {
        background: '#D6E5E6',
      },
      '&:nth-child(4n-2)': {
        background: '#D6E5E6',
      },

      '&:nth-child(4n-3)': {
        background: '#F0FFFF',
      },
      '&:nth-child(4n-4)': {
        background: '#F0FFFF',
      },

      '&:nth-child(2n-1)': {
        fontWeight: 'normal',
        fontSize: 'small',
        borderBottom: '3px solid #D3D3D3',
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
