import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  video: {
    border: '1px solid',
    padding: '5px',
  },
  closeButton: {
    float: 'right',
    cursor: 'pointer',
  },
}));

export default useStyles;
