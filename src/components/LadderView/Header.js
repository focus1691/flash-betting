import React from "react";

export default ({ runner, runnerClick }) => (
  <div className={"ladder-header"}>
    <h2 className="contender-name">
      {
        <img
          className={"contender-image"}
          src={
            runner.metadata.COLOURS_FILENAME
              ? `https://content-cache.cdnbf.net/feeds_images/Horses/SilkColours/${runner.metadata.COLOURS_FILENAME}`
              : `${window.location.origin}/images/baseball-player.png`
          }
          alt={"Colours"}
          onClick={e => {
            runnerClick();
          }}
        />
      }
      {`${
        runner.metadata.CLOTH_NUMBER ? runner.metadata.CLOTH_NUMBER + ". " : ""
      }${runner.runnerName}`}
    </h2>
    <span className="contender-odds">0.80</span>
  </div>
);