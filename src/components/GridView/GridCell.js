import React from "react";

export default ({ odds, matched, key, backLay, oneClickOn, updateOrder }) => (
    <td
    className="grid-cell"
    onClick={() => {
      if (!oneClickOn) {
        updateOrder();
      }
    }}
  >
    <span>{odds}</span>
    <span>{matched}</span>
  </td>
);