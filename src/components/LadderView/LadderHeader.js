import React, {useState} from "react";
import { iconForEvent } from "../../utils/EventIcons";
import { calcBackBet } from "../../utils/TradingStategy/HedingCalculator";

export default ({ selectionId, sportId, runner, runnerClick, setLadderDown, PL, ladderLTPHedge, newStake, oddsHovered }) => {
  return (
    <div className={"ladder-header"}>
      <div>
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
        <div className = "contender-odds-container">
          <span className="contender-odds">{PL}</span>
          <span className="contender-odds" style = {{visibility: oddsHovered.odds > 0 ? 'visible' : 'hidden'}}>
            {/* calculates what to add or subtract based on odds hovered */}
            {((oddsHovered.side == "BACK" && oddsHovered.selectionId === selectionId) || (oddsHovered.side == "LAY" && oddsHovered.selectionId !== selectionId) ? 1 : -1) * parseFloat(calcBackBet(oddsHovered.odds, 2) + 
             ((oddsHovered.side == "BACK" && oddsHovered.selectionId === selectionId) || (oddsHovered.side == "LAY" && oddsHovered.selectionId !== selectionId) ? 1 : -1) * parseFloat(PL)).toFixed(2)} 
          </span>
        </div>
      </div>
      <div>
        <span style={{visibility: ladderLTPHedge === 0 ? 'hidden' : 'visible' }}>{parseFloat(ladderLTPHedge).toFixed(2)}</span>
        <span style={{visibility: newStake === 0 ? 'hidden' : 'visible' }}>{parseFloat(newStake).toFixed(2)}</span>
      </div>
    </div>
  )
};