import { getPLForRunner, getLossForRunner } from '../../utils/Bets/GetProfitAndLoss';

export const columns = [
  { title: 'selection', label: 'Selection' },
  { title: 'win', label: 'If Win' },
  { title: 'lose', label: 'If Lose' },
  { title: 'settled', label: 'Settled' },
  { title: 'result', label: 'Result' },
];

export const createRows = (runners, matchedBets) => {
  const rows = runners.map(({ selectionId, runnerName, status }) => {
    const win = matchedBets ? getPLForRunner(runners.marketId, selectionId, { matched: matchedBets }).toFixed(2) : 0;
    const lose = matchedBets ? getLossForRunner(runners.marketId, selectionId, { matched: matchedBets }).toFixed(2) : 0;
    return {
      selection: runnerName,
      win,
      lose,
      settled: status === 'WINNER' ? win : lose,
      isComplete: status !== 'ACTIVE',
      isWinner: status === 'WINNER',
    };
  });
  
  return rows;
};
