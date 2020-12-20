import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  percentageRow: {
    fontFamily: 'Open Sans',
    fontWeight: '600',
    fontSize: 'x-small',
    display: 'flex',
    flexDirection: 'row',
    '& .th': {
      boxShadow: '0 2px 2px -1px rgba(0, 0, 0, 0.4)',
      outline: '1px solid rgb(178, 181, 181)',
      width: '28%',
      fontSize: 'small',
      fontFamily: 'roboto',
      '&:first-child': {
        background: 'linear-gradient(315deg, #29539b 0%, #1e3b70 74%)',
        color: 'white',
        width: '81%',
      },
      '&:not(:first-child)': {
        textAlign: 'center',
        borderTop: '1px solid #000000',
        borderBottom: '1px solid #000000',
        fontSize: 'small',
        fontFamily: 'roboto',
      },
      '&:nth-child(2)': {
        cursor: 'pointer',
      },
      '&:nth-child(3)': {
        backgroundColor: '#eba8a6',
      },
      '&:nth-child(4)': {
        cursor: 'pointer',
      },
      '&:nth-child(5)': {
        backgroundColor: '#007aaf',
      },
      '&:nth-child(6)': {
        cursor: 'pointer',
      },
    },
  },
}));

export default useStyles;
