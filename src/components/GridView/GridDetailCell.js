import React from "react";

export default ({ name, number, logo, selectRunner, ltp, tv, PL, bg }) => (
  <td
    className="grid-runner-details"
    onClick={e => {
      selectRunner();
    }}
  >
    <img src={logo} alt={"Runner"} />
    <span>{`${number}${name}`}</span>
    <span style={{ background: bg }}>{ltp[0] ? ltp[0] : ""}</span>
    <span style={{color: PL.color}}>{PL.val}</span>
    <span>{tv[0] ? Math.floor(tv[0]).toLocaleString() : ""}</span>
  </td>
);
