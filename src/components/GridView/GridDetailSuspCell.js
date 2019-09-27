import React from "react";

export default ({ name, number, logo, onSelectRunner }) => (
    <td
    className="grid-runner-details"
    onClick={e => {
        onSelectRunner();
    }}
  >
    <img src={`https://content-cache.cdnbf.net/feeds_images/Horses/SilkColours/${logo}`} alt={"Runner"} />
    <span>{`${number}. ${name}`}</span>
  </td>
);