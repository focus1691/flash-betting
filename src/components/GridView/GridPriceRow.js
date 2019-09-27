import React from "react";

export default ({ name, runnerId, orderProps, onUpdateOrderValue }) => (
  <React.Fragment>
    <li
      runnerId={`${orderProps.prices[0]}${name}`}
      onClick={() => {
        onUpdateOrderValue(orderProps.prices[0]);
      }}
    >
      {orderProps.prices[0]}
    </li>
    <li
      runnerId={`${orderProps.prices[1]}${name}`}
      onClick={() => {
        onUpdateOrderValue(orderProps.prices[1]);
      }}
    >
      {orderProps.prices[1]}
    </li>
    <li
      runnerId={`${orderProps.prices[2]}${name}`}
      onClick={() => {
        onUpdateOrderValue(orderProps.prices[2]);
      }}
    >
      {orderProps.prices[2]}
    </li>
    <li
      runnerId={`${orderProps.prices[3]}${name}`}
      onClick={() => {
        onUpdateOrderValue(orderProps.prices[3]);
      }}
    >
      {orderProps.prices[3]}
    </li>
    <li
      runnerId={`${orderProps.prices[4]}${name}`}
      onClick={() => {
        onUpdateOrderValue(orderProps.prices[4]);
      }}
    >
      {orderProps.prices[4]}
    </li>
    <li
      runnerId={`${orderProps.prices[5]}${name}`}
      onClick={() => {
        onUpdateOrderValue(orderProps.prices[5]);
      }}
    >
      {orderProps.prices[5]}
    </li>
    <li
      runnerId={`${orderProps.prices[6]}${name}`}
      onClick={() => {
        onUpdateOrderValue(orderProps.prices[6]);
      }}
    >
      {orderProps.prices[6]}
    </li>
    <li
      runnerId={`${0}${name}`}
      onClick={() => {
        onUpdateOrderValue(0);
      }}
    >
      0
    </li>
  </React.Fragment>
);
