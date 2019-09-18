import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { formatOdds } from "../../utils/CreateFullLadder";

const Ladders = props => {
  const tableRef = useRef(null);

  const createLadder = () => {
    return Object.keys(props.ladder).map(key => {
      const ladder = props.ladder[key].fullLadder;
      const ltp = props.ladder[key].ltp;
      const tv = props.ladder[key].tv ? Math.floor(props.ladder[key].tv[0]).toLocaleString() : "";

      return (
        
          <div className="odds-table">
            {renderHeaderRow(props.runners[key])}

            <div className={"ladder"}>
              <table ref={tableRef}>
                <tbody>
                  {renderPercentageRow(ltp, tv)}
                  {renderData(ladder)}
                  {renderPriceRow()}
                </tbody>
              </table>
            </div>
            {renderOrderRow()}
          </div>
      );
    });
  };

  const renderHeaderRow = runner => {
    const name = runner.runnerName;

    const number = runner.metadata.CLOTH_NUMBER ? runner.metadata.CLOTH_NUMBER + '. ' : "";
    const logo = runner.metadata.COLOURS_FILENAME
      ? `https://content-cache.cdnbf.net/feeds_images/Horses/SilkColours/${runner.metadata.COLOURS_FILENAME}`
      : `${window.location.origin}/images/baseball-player.png`;

    return (
      <div colspan={7} className={"ladder-header"}>
        <h2 className="contender-name">
          {<img className={"contender-image"} src={logo} alt={"Colours"} />}
          {`${number}${name}`}
        </h2>
        <span className="contender-odds">0.80</span>
      </div>
    );
  };

  const renderPercentageRow = (ltp, tv) => {
    const bg =
      ltp[0] < ltp[1] ? "#0AFD03" : ltp[0] > ltp[1] ? "#FC0700" : "#FFFF00";

    return (
      <th colSpan={7}>
        <div className={"percentage-row"}>
          <td colSpan={2}><span>{tv}</span></td>
          <td>--</td>
          <td>60%</td>
          <td style={{ background: bg }}>{ltp[0]}</td>
          <td>40%</td>
          <td>--</td>
        </div>
      </th>
    );
  };

  const renderData = ladder => {
    return Object.keys(ladder).map(key => {
      return (
        <tr key={ladder[key].odds}>
          <td className={"candle-stick-col"} colSpan={2}><img src={`${window.location.origin}/icons/green-candle.png`}/></td>
          <td>{ladder[key].backProfit}</td>
          <td>{ladder[key].backMatched}</td>
          <td>{formatOdds(ladder[key].odds)}</td>
          <td>{ladder[key].layMatched}</td>
          <td>{ladder[key].layProfit}</td>
        </tr>
      );
    });
  };

  const renderPriceRow = () => {
    return (
      <tfoot className="price-row">
        <td>5</td>
        <td>5</td>
        <td>10</td>
        <td>20</td>
        <td>25</td>
        <td>50</td>
        <td>100</td>
      </tfoot>
    );
  };

  const renderOrderRow = () => {
    return (
      <div className={"order-row"}>
        <table>
          <tbody>
            <td colSpan={3} rowSpan={4}>
              <table className="lay-table">
                <tbody>
                  <tr>
                    <td>Order 1</td>
                  </tr>
                  <tr>
                    <td>Order 2</td>
                  </tr>
                  <tr>
                    <td>Order 3</td>
                  </tr>
                  <tr>
                    <td>Order 4</td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td colSpan={1} rowSpan={4}>
              <button>0</button>
              <button>S</button>
              <button>K</button>
            </td>
            <td colSpan={3} rowSpan={4}>
              <table className="lay-table">
                <tbody>
                  <tr>
                    <td>Order 1</td>
                  </tr>
                  <tr>
                    <td>Order 2a</td>
                  </tr>
                  <tr>
                    <td>Order 3</td>
                  </tr>
                  <tr>
                    <td>Order 4</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={"ladder-container"}>
      {props.marketOpen && props.ladder ? createLadder() : null}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currentEvent: state.sports.currentSport.currentEvent,
    marketOpen: state.market.marketOpen,
    market: state.market.currentMarket,
    runners: state.market.runners,
    ladder: state.market.ladder
  };
};

export default connect(mapStateToProps)(Ladders);
