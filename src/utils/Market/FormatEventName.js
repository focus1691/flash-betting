import moment from 'moment';

export default (marketName, marketStartTime, event, eventType) => {
  if (eventType.id === '7') {
    return `${moment(marketStartTime).format('LT')} ${event.venue || ''} ${marketName}`
  }
  if (eventType.id === '1') {
    return `${event.name ? event.name : event.venue ? event.venue : ''} ${moment(marketStartTime).format('LT')}`;
  }
  return `${event.name ? event.name : event.venue ? event.venue : ''} ${moment(marketStartTime).format('LT')}`;
};
