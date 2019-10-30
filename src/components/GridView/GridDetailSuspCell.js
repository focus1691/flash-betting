import React from "react";
import { iconForEvent } from "../../utils/EventIcons";

export default ({ sportId, name, number, logo, onSelectRunner }) => (
  <td
    className="grid-runner-details"
    onClick={onSelectRunner}
  >
    <img src={logo} alt={""} onError={e => {
      e.target.onerror = null;
      e.target.src = iconForEvent(parseInt(sportId));
    }} />
    <span>{`${number}${name}`}</span>
  </td>
);