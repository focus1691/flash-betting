import React, {useState} from "react";

export default ({ runner, runnerClick, parentRef, moveLadder, returnToOrderedPos }) => {
  const [isHeaderDown, setHeaderDown] = useState(false);

  return (
    <div className={"ladder-header"} 
      onMouseDown = {() => setHeaderDown(true)} 
      onMouseUp={() => {
        if (parentRef.current === null) return;
        setHeaderDown(false);
        returnToOrderedPos();
      }}
      onMouseLeave = {() => {
        if (parentRef.current === null) return;
        setHeaderDown(false);
        returnToOrderedPos();
      }}
      onMouseMove = {(e) => {
        if (parentRef.current === null) return;
        if (!isHeaderDown) return;
        moveLadder(e.movementX)
      }}
      >
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
  )
};