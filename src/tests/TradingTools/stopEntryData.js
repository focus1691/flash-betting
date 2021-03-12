import { formatPrice } from '../../utils/ladder/CreateFullLadder';

export const data = {
  111: [
    {
      strategy: 'Stop Entry',
      marketId: '1.254353',
      selectionId: 111,
      targetLTP: formatPrice(1.5),
      stopEntryCondition: '<',
      side: 'BACK',
      size: 5,
      price: formatPrice(3),
      rfs: '22222dsdst3w2twsfs',
    }
  ]
}
