import sportReducer from "../reducers/sportReducer";
import marketReducer from "../reducers/marketReducer";
import accountReducer from "../reducers/accountReducer";
import settingsReducer from "../reducers/settingsReducer";
import orderReducer from "../reducers/orderReducer";
import stopLossReducer from "../reducers/stopLossReducer";
import stopEntryReducer from "../reducers/stopEntryReducer";
import backReducer from "../reducers/backReducer";
import layReducer from "../reducers/layReducer";
import draggableReducer from "../reducers/draggableReducer";
import fillOrKillReducer from "../reducers/fillOrKillReducer";
import tickOffsetReducer from "../reducers/tickOffsetReducer";

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
  draggable: draggableReducer
};
