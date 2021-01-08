import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  deselectIconFirst: {
    display: 'contents',
  },
  deselectText: {
    color: '#999797',
  },
  deselectLast: {
    filter: 'drop-shadow(2px 4px 12px #64D96A)',
  },
}));

export default useStyles;
