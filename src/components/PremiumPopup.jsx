import React, { useEffect, forwardRef } from 'react';
import { connect } from 'react-redux';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
//* @material-ui core
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
//* @material-ui icons
import CloseIcon from '@material-ui/icons/Close';
//* Actions
import { openPremiumDialog } from '../actions/settings';
//* JSS
import useStyles from '../jss/components/PremiumPopup';
//* Constants
import { FLASH_BETTING_PAYMENT_URL } from '../constants';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const PremiumPopup = ({ open, premiumMember, openPremiumDialog }) => {
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
    window.open(FLASH_BETTING_PAYMENT_URL);
    // const { error, paymentMethod } = await stripe.createPaymentMethod({
    //   type: 'card',
    //   card: elements.getElement(CardElement),
    // });
  };

  return (
    <Dialog open={open} onClose={() => openPremiumDialog(false)} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => openPremiumDialog()} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Flash Betting Premium Licence
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.content}>
        <DialogContentText>Click the button below to be directed to the payment page to pay for a premium licence.</DialogContentText>
        <Button className={classes.submit} onClick={handleSubmit} variant="contained">
          Buy
        </Button>
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
});

const mapDispatchToProps = { openPremiumDialog };

export default connect(mapStateToProps, mapDispatchToProps)(PremiumPopup);
