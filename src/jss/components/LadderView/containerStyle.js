import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    position: 'absolute',
    width: '18rem',
    height: '100%',
    float: 'left',
    padding: '0',
    border: '2px solid #d8d9d9',
    visibility: 'collapse',
    zIndex: '0',
    opacity: '1.0',
    transition: 'opacity 0.25s ease-in-out 0s',
  },
}));

export default useStyles;
