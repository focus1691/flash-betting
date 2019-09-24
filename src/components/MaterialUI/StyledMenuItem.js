import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";

export default withStyles(theme => ({
  root: {
    fontSize: "x-small",
    display: 'flex',
    marginRight: '-4px',
    marginTop: '-15%',
    marginBottom: '-15%',
    "&:focus": {
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);
