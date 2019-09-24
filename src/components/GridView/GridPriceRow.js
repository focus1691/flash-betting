import React from "react";

export default ({ name, key, orderProps, updateOrderValue }) => (
  <React.Fragment>
    <li
      key={`${orderProps.prices[0]}${name}`}
      onClick={() => {
        updateOrderValue(orderProps.prices[0]);
      }}
    >
      {orderProps.prices[0]}
    </li>
    <li
      key={`${orderProps.prices[1]}${name}`}
      onClick={() => {
        updateOrderValue(orderProps.prices[1]);
      }}
    >
      {orderProps.prices[1]}
    </li>
    <li
      key={`${orderProps.prices[2]}${name}`}
      onClick={() => {
        updateOrderValue(orderProps.prices[2]);
      }}
    >
      {orderProps.prices[2]}
    </li>
    <li
      key={`${orderProps.prices[3]}${name}`}
      onClick={() => {
        updateOrderValue(orderProps.prices[3]);
      }}
    >
      {orderProps.prices[3]}
    </li>
    <li
      key={`${orderProps.prices[4]}${name}`}
      onClick={() => {
        updateOrderValue(orderProps.prices[4]);
      }}
    >
      {orderProps.prices[4]}
    </li>
    <li
      key={`${orderProps.prices[5]}${name}`}
      onClick={() => {
        updateOrderValue(orderProps.prices[5]);
      }}
    >
      {orderProps.prices[5]}
    </li>
    <li
      key={`${orderProps.prices[6]}${name}`}
      onClick={() => {
        updateOrderValue(orderProps.prices[6]);
      }}
    >
      {orderProps.prices[6]}
    </li>
    <li
      key={`${0}${name}`}
      onClick={() => {
        updateOrderValue(0);
      }}
    >
      0
    </li>
  </React.Fragment>
);
