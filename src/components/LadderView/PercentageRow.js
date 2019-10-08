import React from "react";

export default ({ ltp, tv, percent }) => (
  <div className = {"percentage-row"}>
    <div colSpan={3} className={'th'}>{tv}</div>
    <div className = {"th"}></div>
    <div className = {"th"}>{`${percent.back}%`}</div>
    <div className = {"th"} 
      style={{
          background:
            ltp[0] < ltp[1]
              ? "#0AFD03"
              : ltp[0] > ltp[1]
              ? "#FC0700"
              : "#FFFF00"
        }}>
          {ltp[0]}
        </div>
    <div className = {"th"}>{`${percent.lay}%`}</div>
    <div className = {"th"}></div>
  </div>
);
