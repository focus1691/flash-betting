import React from "react";

export default ({ ltp, tv, percent, setLadderSideLeft, ladderSideLeft }) => {
  
  const leftSide = ladderSideLeft.toLowerCase()
  
  return (
    <div className = {"percentage-row"}>
      <div colSpan={3} className={'th'}>{tv}</div>
      <div className = {"th"}></div>
      <div className = {"th"} style={{backgroundColor: leftSide == 'lay' ? "#FCC9D3" : "#BCE4FC"}}>
        {`${percent[leftSide]}%`}
      </div>
      <div className = {"th"} 
        style={{
            background:
              ltp[0] < ltp[1]
                ? "#0AFD03"
                : ltp[0] > ltp[1]
                ? "#FC0700"
                : "#FFFF00",
            cursor: 'pointer'
          }}
          onClick = {() => {
            setLadderSideLeft(ladderSideLeft === "LAY" ? "BACK" : "LAY")
          }}
          >
            {ltp[0]}
          </div>
      <div className = {"th"} style={{backgroundColor: leftSide == 'lay' ? "#BCE4FC" : "#FCC9D3"}}>
        {`${percent[leftSide === "lay" ? "back" : "lay"]}%`}</div>
      <div className = {"th"}></div>
    </div>
  )
};
