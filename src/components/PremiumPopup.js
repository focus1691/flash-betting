import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import * as actions from '../actions/settings';
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import DropIn from "braintree-web-drop-in-react";
import PaypalExpressBtn from 'react-paypal-express-checkout';
import { getDate30DaysAhead } from "../utils/DateCalculator";

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  paypal: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const FullScreenDialog = props => {
  const classes = useStyles();
  const [clientToken, setClientToken] = useState(null);
  var instance;

  const getToken = async () => {
    // Get a client token for authorization from your server
    await fetch("/api/generate-client-token")
    .then(res => res.json())
    .then(data => { console.log(data); setClientToken(data.clientToken) });
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (props.premiumMember) {
      props.openPremiumDialog(false);
    }
  }, [props.premiumMember]);

  const buy = async () => {
    // Send the nonce to your server
    const { nonce } = await this.instance.requestPaymentMethod();
    await fetch(`server.test/purchase/${nonce}`);
  }

  const renderForm = () => {
    if (clientToken) {
      return (
        <React.Fragment>
          <DropIn
            options={{ authorization: clientToken }}
            onInstance={instance => (this.instance = instance)}
          />
          <button onClick={buy.bind(this)}>Buy</button>
        </React.Fragment>
      );
    }
    return null;
  }

  return (
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
      <DialogContent>
        <DialogContentText>
          You are required to pay the monthly subscription fee of £9.99 in order to access Trader Pro's advanced features.
          </DialogContentText>

        {renderForm()}

        {/* <PaypalExpressBtn className={classes.paypal} env={'sandbox'} client={{
            sandbox: 'ARDKtjP_BpHKUgh58tk1RsXHlxbdlmPC0FVhXRFX2zysVNxBMGnUSTPDAUCkKcQ9pwKYWx4slLhwCSZS',
            production: 'YOUR-PRODUCTION-APP-ID',
          }} currency={'GBP'} total={9.99}
            onError={err => {
              // The main Paypal's script cannot be loaded or somethings block the loading of that script!
              return;
              // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
              // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
            }}
            onSuccess={payment => {
              // Congratulation, it came here means everything's fine!
              props.setPremiumStatus(true);
              props.openPremiumDialog(false);
              payment.expiresIn = getDate30DaysAhead();
              return fetch("/paypal-transaction-complete", {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(payment)
              });
              // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
            }}
            onCancel={data => {
              // User pressed "cancel" or close Paypal's popup!
              return;
              // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
            }} /> */}
      </DialogContent>
    </Dialog>
  );
}

const mapStateToProps = state => {
  return {
    open: state.settings.premiumPopupOpen,
    premiumMember: state.settings.premiumMember
  }
}

const mapDispatchToProps = dispatch => {
  return {
    openPremiumDialog: open => dispatch(actions.openPremiumDialog(open)),
    setPremiumStatus: isPremium => dispatch(actions.setPremiumStatus(isPremium))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FullScreenDialog);