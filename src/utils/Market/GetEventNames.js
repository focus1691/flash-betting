export default (sportId) => {
  switch (Number(sportId)) {
    case 1:
      return 'Soccer';
    case 2:
      return 'Tennis';
    case 3:
      return 'Golf';
    case 4:
      return 'Cricket';
    case 5:
      return 'Rugby Union';
    case 1477:
      return 'Rugby League';
    case 6:
      return 'Boxing';
    case 7:
      return 'Horse Racing';
    case 8:
      return 'Motor Sport';
    case 27454571:
      return 'Esports';
    case 10:
      return 'Special Bets';
    case 998917:
      return 'Volleyball';
    case 11:
      return 'Cycling';
    case 998916:
      return 'Yachting';
    case 2152880:
      return 'Gaelic Games';
    case 315220:
      return 'Poker';
    case 3988:
      return 'Athletics';
    case 4339:
      return 'Greyhound Racing';
    case 6422:
      return 'Snooker';
    case 6423:
      return 'American Football';
    case 7511:
      return 'Baseball';
    case 451485:
      return 'Winter Sports';
    case 7522:
      return 'Basketball';
    case 7524:
      return 'Ice Hockey';
    case 61420:
      return 'Australian Rules';
    case 468328:
      return 'Handball';
    case 3503:
      return 'Darts';
    case 26420387:
      return 'Mixed Martial Arts';
    case 2378961:
      return 'Politics';
    default:
      return '';
  }
};
