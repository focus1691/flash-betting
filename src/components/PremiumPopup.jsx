import React, { useEffect, forwardRef } from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
//* @material-ui icons
import CloseIcon from '@material-ui/icons/Close';
//* Actions
import { openPremiumDialog } from '../redux/actions/settings';
//* JSS
import useStyles from '../jss/components/PremiumPopup';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const PremiumPopup = ({ open, premiumMember, openPremiumDialog }) => {
  const classes = useStyles();

  useEffect(() => {
    if (premiumMember) {
      openPremiumDialog(false);
    }
  }, [premiumMember]);

  const handleOpenWebsite = () => {
    window.open('https://www.flashbetting.co.uk', '_blank');
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
        <DialogContentText>
          To purchase a premium subscription to Flash Betting you must do so in your web browser. Go to
          <Button onClick={handleOpenWebsite}>
            {' '}
            <b><u>www.flashbetting.co.uk</u></b>
            {' '}
          </Button>
          and navigate to the purchase page. You can manage your subscriptions, and track your payments there.
        </DialogContentText>
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
