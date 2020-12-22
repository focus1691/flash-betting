import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export const ToolsTableCell = withStyles((theme) => ({
  root: {
    color: '#c7c2c2',
  },
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
    border: 0,
  },
}))(TableCell);

export const ToolsTableRow = withStyles((theme) => ({
  root: {
    // backgroundColor: '#3a3b3c',
  },
}))(TableRow);
