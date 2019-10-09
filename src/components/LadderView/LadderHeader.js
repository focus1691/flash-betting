import React, {useState} from "react";
import { iconForEvent } from "../../utils/EventIcons";

export default ({ sportId, runner, runnerClick, setLadderDown, sportID }) => {

  return (
    <div className={"ladder-header"}>
      <h2 className="contender-name"
        onMouseDown = {() => {
          setLadderDown(true)
        }} 
      >
        {
          <img
            className={"contender-image"}
            src={
              runner.metadata.COLOURS_FILENAME && parseInt(sportId) === 7
                ? `https://content-cache.cdnbf.net/feeds_images/Horses/SilkColours/${runner.metadata.COLOURS_FILENAME}`
                : iconForEvent(sportId)
            }
            alt={"Colours"}
            onClick={e => {
              runnerClick();
            }}
            onError={e => {
              e.target.onerror = null;
              e.target.src = iconForEvent(parseInt(sportId));
            }}
          />
        }
        {`${
          runner.metadata.CLOTH_NUMBER ? runner.metadata.CLOTH_NUMBER + ". " : ""
        }${runner.runnerName}`}
      </h2>
      <span className="contender-odds">0.80</span>
    </div>
  )
};