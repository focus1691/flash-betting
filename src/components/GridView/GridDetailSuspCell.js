import React from "react";
import { iconForEvent } from "../../utils/Market/EventIcons";

export default ({ sportId, name, number, logo, onSelectRunner }) => {
  const handleImageError = sportId => e => {
    e.target.onerror = null;
    e.target.src = iconForEvent(parseInt(sportId));
  };

  return (
    <td
      className="grid-runner-details"
      onClick={onSelectRunner}
    >
      <img src={logo} alt={""} onError={handleImageError(sportId)} />
      <span>{`${number}${name}`}</span>
    </td>
  );
};