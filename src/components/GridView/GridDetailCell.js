import React from "react";
import { iconForEvent } from "../../utils/EventIcons";

export default ({ sportId, name, number, logo, selectRunner, ltp, tv, PL, bg }) => (
  <td
    className="grid-runner-details"
    onClick={e => {
      selectRunner();
    }}
  >
    <img src={logo} onError={e => {
      e.target.onerror = null;
      e.target.src = iconForEvent(parseInt(sportId));
    }}/>
    <span>{`${number}${name}`}</span>
    <span style={{ background: bg }}>{ltp[0] ? ltp[0] : ""}</span>
    <span style={{color: PL.color}}>{PL.val}</span>
    <span>{tv[0] ? Math.floor(tv[0]).toLocaleString() : ""}</span>
  </td>
);
