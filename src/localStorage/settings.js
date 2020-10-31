export const setupStorage = () => {
  if (localStorage.getItem('defaultView') === null) {
    localStorage.setItem('defaultView', 'HomeView');
  }
  if (localStorage.getItem('sounds') === null) {
    localStorage.setItem('sounds', false);
  }
  if (localStorage.getItem('tools') === null) {
    localStorage.setItem('tools', JSON.stringify({ visible: true, open: false }));
  }
  if (localStorage.getItem('unmatchedBets') === null) {
    localStorage.setItem('unmatchedBets', JSON.stringify({ visible: true, open: false }));
  }
  if (localStorage.getItem('matchedBets') === null) {
    localStorage.setItem('matchedBets', JSON.stringify({ visible: true, open: false }));
  }
  if (localStorage.getItem('graphs') === null) {
    localStorage.setItem('graphs', JSON.stringify({ visible: true, open: false }));
  }
  if (localStorage.getItem('marketInfo') === null) {
    localStorage.setItem('marketInfo', JSON.stringify({ visible: true, open: false }));
  }
  if (localStorage.getItem('winMarketsOnly') === null) {
    localStorage.setItem('winMarketsOnly', true);
  }
  if (localStorage.getItem('rules') === null) {
    localStorage.setItem('rules', JSON.stringify({ visible: true, open: false }));
  }
  if (localStorage.getItem('ladderUnmatched') === null) {
    localStorage.setItem('ladderUnmatched', 'hedged');
  }
  if (localStorage.getItem('stakeBtns') === null) {
    localStorage.setItem('stakeBtns', JSON.stringify([2, 4, 6, 8, 10, 12, 14]));
  }
  if (localStorage.getItem('layBtns') === null) {
    localStorage.setItem('layBtns', JSON.stringify([2.5, 5, 7.5, 10, 12.5, 15, 17.5]));
  }
  if (localStorage.getItem('horseRaces') === null) {
    localStorage.setItem('horseRaces', JSON.stringify({
      GB: true,
      IE: false,
      FR: false,
      DE: false,
      IT: false,
      AE: false,
      TR: false,
      SG: false,
      SE: false,
      US: false,
      AU: false,
      NZ: false,
      ZA: false,
    }));
  }
  if (localStorage.getItem('rightClickTicks') === null) {
    localStorage.setItem('rightClickTicks', 1);
  }
  if (localStorage.getItem('laddersExpanded') === null) {
    localStorage.setItem('laddersExpanded', false);
  }
  if (localStorage.getItem('toolsExpanded') === null) {
    localStorage.setItem('toolsExpanded', false);
  }
  if (localStorage.getItem('unmatchedBetsExpanded') === null) {
    localStorage.setItem('unmatchedBetsExpanded', false);
  }
  if (localStorage.getItem('matchedBetsExpanded') === null) {
    localStorage.setItem('matchedBetsExpanded', false);
  }
  if (localStorage.getItem('graphExpanded') === null) {
    localStorage.setItem('graphExpanded', false);
  }
  if (localStorage.getItem('marketInfoExpanded') === null) {
    localStorage.setItem('marketInfoExpanded', false);
  }
  if (localStorage.getItem('rulesExpanded') === null) {
    localStorage.setItem('rulesExpanded', false);
  }
};

export const setItem = (item, data) => {
  if (item === 'sounds' || item === 'ladderUnmatched' || item === 'rightClickTicks') {
    localStorage.setItem(item, data);
  }
  else {
    localStorage.setItem(item, JSON.stringify(data));
  }
};
