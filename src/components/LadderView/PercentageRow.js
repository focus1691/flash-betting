import React from "react";

export default ({ ltp, tv, percent }) => (
  <tr className = {"percentage-row"}>
    <th colSpan={3}>{tv}</th>
    <th></th>
    <th>{`${percent.back}%`}</th>
    <th style={{
          background:
            ltp[0] < ltp[1]
              ? "#0AFD03"
              : ltp[0] > ltp[1]
              ? "#FC0700"
              : "#FFFF00"
        }}>
          {ltp[0]}
        </th>
    <th>{`${percent.lay}%`}</th>
    <th></th>
  </tr>
);
