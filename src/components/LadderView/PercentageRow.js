import React from "react";

export default ({ ltp, tv }) => (
  <th colSpan={7}>
    <div className={"percentage-row"}>
      <td colSpan={2}>
        <span>{tv}</span>
      </td>
      <td>--</td>
      <td>60%</td>
      <td
        style={{
          background:
            ltp[0] < ltp[1]
              ? "#0AFD03"
              : ltp[0] > ltp[1]
              ? "#FC0700"
              : "#FFFF00"
        }}
      >
        {ltp[0]}
      </td>
      <td>40%</td>
      <td>--</td>
    </div>
  </th>
);
