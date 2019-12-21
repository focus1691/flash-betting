import { createReducer } from '@reduxjs/toolkit'

const initialState = {
    ladder: {}
}

const reducer = createReducer(initialState, {
    LOAD_LADDER: (state, action) => {
        console.log(action.payload);
      return { ...state, ladder: action.payload };
    },

    ADD_LADDER: (state, action) => {
        console.log(state);
        state.ladder[action.payload.id] = action.payload.ladder
    },
    UPDATE_LTP: (state, action) => {
        console.log(action.payload);
      state.ladder[action.payload.id].ltp = [action.payload.ltp, ...state.ladder[action.payload.id].ltp];
      state.ladder[action.payload.id].ltpDelta = new Date();
  }
});

export default reducer;