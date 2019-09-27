import React from "react";
import { connect } from 'react-redux';
import * as actions from '../actions/settings';
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { PayPalButton } from "react-paypal-button-v2";

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenDialog = props => {
  const classes = useStyles();

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={e => props.openPremiumDialog(false)}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={e => props.openPremiumDialog()}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Sports Trader Pro Licence
            </Typography>
          </Toolbar>
        </AppBar>
        <PayPalButton
          amount="0.01"
          onSuccess={(details, data) => {
            alert("Transaction completed by " + details.payer.name.given_name);

            // OPTIONAL: Call your server to save the transaction
            // return fetch("/paypal-transaction-complete", {
            //   method: "post",
            //   body: JSON.stringify({
            //     orderID: data.orderID
            //   })
            // });
          }}
        />
      </Dialog>
    </div>
  );
}

const mapStateToProps = state => {
	return {
		open: state.settings.premiumPopupOpen
	}
}

const mapDispatchToProps = dispatch => {
	return {
		openPremiumDialog: open => dispatch(actions.openPremiumDialog(open))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FullScreenDialog);