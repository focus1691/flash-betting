import React from "react";
import { iconForEvent } from "../../utils/EventIcons";

export default ({ sportId, name, number, logo, selectRunner }) => (
  <td
    className="grid-runner-details"
    onClick={selectRunner()}
  >
    <img src={logo} onError={e => {
      e.target.onerror = null;
      e.target.src = iconForEvent(parseInt(sportId));
    }} />
    <span>{`${number}${name}`}</span>
  </td>
);