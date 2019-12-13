import AppBar from "@material-ui/core/AppBar";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import DropIn from "braintree-web-drop-in-react";
import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import * as actions from '../actions/settings';
import { getDate180DaysAhead, getDate1YearAhead, getDate30DaysAhead } from "../utils/DateCalculator";

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
  const [instance, setInstance] = useState(null);

  const getToken = async () => {
    // Get a client token for authorization from your server
    await fetch("/api/generate-client-token")
      .then(res => res.json())
      .then(data => setClientToken(data.clientToken));
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
    const { nonce } = await instance.requestPaymentMethod();
    await fetch(`/api/checkout/`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        payment_method_nonce: nonce,
        expiresIn: props.selectedPremium === 'monthly' ? getDate30DaysAhead() : props.selectedPremium === 'biannually' ? getDate180DaysAhead() : getDate1YearAhead(),
        amount: props.selectedPremium === 'monthly' ? 9.99 : props.selectedPremium === 'biannually' ? 49.99 : 99.99
      })
    }).then(res => {
      props.setPremiumStatus(true);
      props.openPremiumDialog(false);
    });
  }

  const renderForm = () => {
    if (clientToken) {
      return (
        <React.Fragment>
          <DropIn
            options={{ authorization: clientToken }}
            onInstance={instance => { setInstance(instance) }}
          />
          <button onClick={buy}>Buy</button>
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
          You are required to pay the monthly subscription fee of £{props.selectedPremium === 'monthly' ? 9.99 : props.selectedPremium === 'biannually' ? 49.99 : 99.99} in order to access Trader Pro's advanced features.
          </DialogContentText>

        {renderForm()}
      </DialogContent>
    </Dialog>
  );
}

const mapStateToProps = state => {
  return {
    open: state.settings.premiumPopupOpen,
    premiumMember: state.settings.premiumMember,
    selectedPremium: state.settings.selectedPremium
  }
}

const mapDispatchToProps = dispatch => {
  return {
    openPremiumDialog: open => dispatch(actions.openPremiumDialog(open)),
    setPremiumStatus: isPremium => dispatch(actions.setPremiumStatus(isPremium))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FullScreenDialog);