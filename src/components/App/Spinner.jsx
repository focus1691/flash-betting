import React from 'react';
import Loader from 'react-loader-spinner';

export default () => (
  <div id="spinner" data-testid="spinner">
    <Loader type="ThreeDots" color="#007aaf" height={100} width={100} />
  </div>
);
