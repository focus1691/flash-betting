import React from "react";
import { connect } from "react-redux";

const Ladders = props => {

  const createLadder = () => {
    return Object.keys(props.ladder).map(key => {
      const ladder = props.ladder[key].fullLadder;
      const ltp = props.ladder[key].ltp;

      return (
        <div className="odds-table">
          {renderHeaderRow(props.runners[key])}

          <div className={"ladder"}>
            <table>
              <tbody>
                {renderPercentageRow(ltp)}
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
    const number = runner.metadata.CLOTH_NUMBER + ". " || "";
    const logo = runner.metadata.COLOURS_FILENAME
    ? `https://content-cache.cdnbf.net/feeds_images/Horses/SilkColours/${runner.metadata.COLOURS_FILENAME}`
    : `${window.location.origin}/images/baseball-player.png`;

    return (
      <div colspan={5} className={"ladder-header"}>
        <h2 className="contender-name">{<img src={logo} alt={"Colours"} />}{`${number}${name}`}</h2>
        <p className="contender-odds">0.80</p>
      </div>
    );
  };

  const renderPercentageRow = ltp => {
    const bg =
      ltp[0] < ltp[1] ? "#0AFD03" : ltp[0] > ltp[1] ? "#FC0700" : "#FFFF00";

    return (
      <th colSpan={5}>
        <div className={"percentage-row"}>
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
          <td>{ladder[key].backProfit}</td>
          <td>{ladder[key].backMatched}</td>
          <td>{ladder[key].odds}</td>
          <td>{ladder[key].layMatched}</td>
          <td>{ladder[key].layProfit}</td>
        </tr>
      );
    });
  };

  const renderTableData = data => {
    return data.map(price => {
      return (
        <tr>
          <td>{}</td>
          <td>{Math.floor(price[1])}</td>
          <td>{price[0]}</td>
          <td>{Math.floor(price[1])}</td>
          <td> </td>
        </tr>
      );
    });
  };

  const renderPriceRow = () => {
    return (
      <tfoot colSpan={6} className="price-row">
        <div>
          <td>5</td>
          <td>5</td>
          <td>10</td>
          <td>20</td>
          <td>25</td>
          <td>50</td>
          <td>100</td>
        </div>
      </tfoot>
    );
  };

  const renderOrderRow = () => {
    return (
      <div className={"order-row"}>
        <table>
          <tbody>
            <td colSpan={2} rowSpan={3}>
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
            <td colSpan={1} rowSpan={3}>
              <button>0</button>
              <button>S</button>
              <button>K</button>
            </td>
            <td colSpan={2} rowSpan={3}>
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

  const renderUnMatchedBets = () => {
    return <></>;
  };

  return (
    <React.Fragment>
      {/* {createLadder()} */}
      {props.marketOpen && props.ladder ? createLadder() : null}
      {/* {props.marketOpen && props.ladder ? createLadder() : null} */}
    </React.Fragment>
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
