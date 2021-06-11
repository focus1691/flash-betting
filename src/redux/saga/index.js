import { put, takeEvery, all, putResolve, throttle, call } from 'redux-saga/effects';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function* helloSaga() {
  console.log('Hello Sagas!');
}

function* takeBreak() {
  const response = yield fetch('https://reqres.in/api/users/2');
  const json = yield response.json();
  console.log(json);
}

function* incrementAsync() {
  yield delay(1000);
  yield call(takeBreak);
  // console.log(res);
  yield put({ type: 'INCREMENT' });
  yield put({ type: 'INCREMENT' });
}

function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync);
}

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([helloSaga(), watchIncrementAsync()]);
}
