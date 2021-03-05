import sportReducer from './sportReducer';
import marketReducer from './marketReducer';
import accountReducer from './accountReducer';
import settingsReducer from './settingsReducer';
import orderReducer from './orderReducer';
import stopLossReducer from './stopLossReducer';
import stopEntryReducer from './stopEntryReducer';
import backReducer from './backReducer';
import layReducer from './layReducer';
import draggableReducer from './draggableReducer';
import fillOrKillReducer from './fillOrKillReducer';
import tickOffsetReducer from './tickOffsetReducer';

export default {
  account: accountReducer,
  sports: sportReducer,
  market: marketReducer,
  settings: settingsReducer,
  order: orderReducer,
  stopLoss: stopLossReducer,
  tickOffset: tickOffsetReducer,
  back: backReducer,
  lay: layReducer,
  fillOrKill: fillOrKillReducer,
  stopEntry: stopEntryReducer,
  draggable: draggableReducer,
};
