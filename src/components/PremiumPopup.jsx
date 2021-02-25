import React, { useEffect, forwardRef } from 'react';
import { connect } from 'react-redux';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
//* @material-ui core
import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
//* @material-ui icons
import CloseIcon from '@material-ui/icons/Close';
//* Actions
import { openPremiumDialog, setPremiumStatus } from '../actions/settings';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
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

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const PremiumPopup = ({ open, premiumMember, selectedPremium, openPremiumDialog, setPremiumStatus }) => {
  const classes = useStyles();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (premiumMember) {
      openPremiumDialog(false);
    }
  }, [premiumMember]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
  };

  return (
    <Dialog open={open} onClose={() => openPremiumDialog(false)} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => openPremiumDialog()} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Sports Flash Betting Licence
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <DialogContentText>{`You are required to pay the monthly subscription fee of £${selectedPremium === 'monthly' ? 10 : selectedPremium === 'biannually' ? 50 : 100} in order to access Flash Betting&apos;s advanced features.`}</DialogContentText>
        <CardElement />
        <form onSubmit={handleSubmit}>
          <button type="submit" disabled={!stripe}>
            Pay
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  open: state.settings.premiumPopupOpen,
  premiumMember: state.settings.premiumMember,
  selectedPremium: state.settings.selectedPremium,
});

const mapDispatchToProps = { openPremiumDialog, setPremiumStatus };

export default connect(mapStateToProps, mapDispatchToProps)(PremiumPopup);
