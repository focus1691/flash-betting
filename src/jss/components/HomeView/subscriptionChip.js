const subscriptionChip = (theme) => ({
  background: '#0BBF63',
  color: '#121212',
  fontFamily: 'Roboto',
  fontWeight: 'bold',
  marginLeft: theme.spacing(1),
  padding: theme.spacing(2, 1),
  [theme.breakpoints.down('sm')]: {
    width: '50%',
    padding: '0',
    margin: '0',
  },
});

export default subscriptionChip;
