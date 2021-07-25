import { checkStopEntryTargetMet, extractStopEntryRfs } from '../../utils/TradingStategy/StopEntry';
//* Data
import { data } from './stopEntryData';

describe('Calculate the stop entry based on the operator (< = >) and trigger price', () => {
  it('Stop entry trigger price < 1.50 target met with string values', () => {
    expect(extractStopEntryRfs(checkStopEntryTargetMet(data[111], '1.49'))).toHaveLength(1);
    expect(extractStopEntryRfs(checkStopEntryTargetMet(data[111], '1.01'))).toHaveLength(1);
  });

  it('Stop entry trigger price < 1.50 target not met, mixed number/strings', () => {
    expect(extractStopEntryRfs(checkStopEntryTargetMet(data[111], '1.60'))).toHaveLength(0);
    expect(extractStopEntryRfs(checkStopEntryTargetMet(data[111], '2'))).toHaveLength(0);
    expect(extractStopEntryRfs(checkStopEntryTargetMet(data[111], 10))).toHaveLength(0);
    expect(extractStopEntryRfs(checkStopEntryTargetMet(data[111], 1.5))).toHaveLength(0);
    expect(extractStopEntryRfs(checkStopEntryTargetMet(data[111], 2.5))).toHaveLength(0);
  });

  it('Stop entry trigger price < 1.50 target met, check rfs value', () => {
    expect(extractStopEntryRfs(checkStopEntryTargetMet(data[111], '1.01'))).toContain('22222dsdst3w2twsfs');
  });
});
