import { getPLForRunner, getLossForRunner } from '../../utils/Bets/GetProfitAndLoss';

export const columns = [
  { title: 'selection', label: 'Selection' },
  { title: 'win', label: 'If Win' },
  { title: 'lose', label: 'If Lose' },
  { title: 'settled', label: 'Settled' },
  { title: 'result', label: 'Result' },
];

export const createRows = (runners, runnerResults, matchedBets) => {
  console.log(runnerResults, matchedBets);
  const rows = runnerResults.map(({ marketId, selectionId, status }) => {
    const win = matchedBets ? getPLForRunner(marketId, selectionId, matchedBets).toFixed(2) : 0;
    const lose = matchedBets ? getLossForRunner(marketId, selectionId, matchedBets).toFixed(2) : 0;
    return {
      selection: runners[selectionId] ? runners[selectionId].runnerName : selectionId,
      win,
      lose,
      settled: status === 'WINNER' ? win : lose,
      isComplete: status !== 'ACTIVE',
      isWinner: status === 'WINNER',
    };
  });

  return rows;
};
