import React from "react";
import { iconForEvent } from "../../utils/EventIcons";
import { calcBackBet } from "../../utils/TradingStategy/HedingCalculator";

export default ({ selectionId, sportId, runner, runnerClick, setLadderDown, PL, ladderLTPHedge, newStake, oddsHovered, ordersOnMarket }) => {
  
  const oddsHoveredCalc = ((oddsHovered.side == "BACK" && oddsHovered.selectionId === selectionId) || (oddsHovered.side == "LAY" && oddsHovered.selectionId !== selectionId) ? 1 : -1) * parseFloat(calcBackBet(oddsHovered.odds, 2) + 
  ((oddsHovered.side == "BACK" && oddsHovered.selectionId === selectionId) || (oddsHovered.side == "LAY" && oddsHovered.selectionId !== selectionId) ? 1 : -1) * parseFloat(PL)).toFixed(2);

  const handleMouseDown = () => e => {
    setLadderDown(true);
  };

  return (
    <div className={"ladder-header"}>
      <div>
        <h2 className="contender-name"
          onMouseDown = {handleMouseDown()} 
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
              onClick={runnerClick}
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
          <span className="contender-odds"
            style = {{
              visibility: ordersOnMarket ? 'visible' : 'hidden',
              color: PL > 0 ? 'rgb(106, 177, 79)' : 'red'
            }}
          >{PL}</span>
          <span className="contender-odds" 
            style = {{visibility: oddsHovered.odds > 0 && ordersOnMarket ? 'visible' : 'hidden',
                      color: oddsHoveredCalc > 0 ? 'rgb(106, 177, 79)' : 'red'}}>
            {/* calculates what to add or subtract based on odds hovered */}
            {oddsHoveredCalc} 
          </span>
        </div>
      </div>
      <div>
        <span style={{visibility: ladderLTPHedge === 0 ? 'hidden' : 'visible', color: parseFloat(ladderLTPHedge).toFixed(2) > 0 ? 'rgb(106, 177, 79)' : 'red'}}>
          {parseFloat(ladderLTPHedge).toFixed(2)}
        </span>
        <span style={{visibility: newStake === 0 ? 'hidden' : 'visible', color: parseFloat(newStake).toFixed(2) > 0 ? 'rgb(106, 177, 79)' : 'red' }}>
          {parseFloat(newStake).toFixed(2)}
        </span>
      </div>
    </div>
  )
};