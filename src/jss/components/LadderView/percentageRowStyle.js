import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  percentageRow: {
    fontFamily: 'Open Sans',
    fontWeight: '600',
    fontSize: 'x-small',
    display: 'flex',
    flexDirection: 'row',
    '& .th': {
      boxShadow: '0 2px 2px -1px rgba(0, 0, 0, 0.4)',
      width: '28%',
      fontSize: 'small',
      fontFamily: 'Lato',
      '&:first-child': {
        textAlign: 'center',
        borderRadius: theme.spacing(4, 0, 0, 4),
        backgroundImage: 'linear-gradient(-39deg, #4c82c2 0%, #254b8f 100%)',
        color: 'white',
        width: '81%',
      },
      '&:not(:first-child)': {
        textAlign: 'center',
        fontSize: 'small',
        fontFamily: 'Lato',
      },
      '&:nth-child(2)': {
        backgroundColor: '#525f6c',
        cursor: 'pointer',
      },
      '&:nth-child(3)': {
        color: '#fff',
        backgroundColor: '#de8384',
      },
      '&:nth-child(4)': {
        cursor: 'pointer',
      },
      '&:nth-child(5)': {
        color: '#fff',
        backgroundColor: '#2a7595',
      },
      '&:nth-child(6)': {
        backgroundColor: '#525f6c',
        cursor: 'pointer',
      },
    },
  },
}));

export default useStyles;
