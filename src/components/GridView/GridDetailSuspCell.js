import React from "react";

export default ({ runner, selectRunner }) => (
    <td
    className="grid-runner-details"
    onClick={e => {
        selectRunner();
    }}
  >
    <img src={runner.metadata.COLOURS_FILENAME} alt={"Runner"} />
    <span>{`${runner.metadata.CLOTH_NUMBER}${runner.runnerName}`}</span>
  </td>
);