const subscriptionChip = (theme, subscribed) => ({
  background: subscribed ? '#0BBF63' : '#F44336',
  color: '#121212',
  font: 'normal normal bold medium Roboto',
  marginLeft: theme.spacing(1),
  padding: theme.spacing(2, 1),
});

export default subscriptionChip;
