import React from "react";
import { iconForEvent } from "../../utils/EventIcons";

export default ({ sportId, name, number, logo, onSelectRunner }) => (
  <td
    className="grid-runner-details"
    onClick={e => {
      onSelectRunner();
    }}
  >
    <img src={logo} onError={e => {
      e.target.onerror = null;
      e.target.src = iconForEvent(parseInt(sportId));
    }} />
    <span>{`${number}${name}`}</span>
  </td>
);