import React from "react";
import { connect } from "react-redux";

const Ladders = props => {
  // const sortDes = arr => {
  //   if (arr.length <= 0) return [];

  //   arr = arr.sort((a, b) => {
  //     return b[0] - a[0];
  //   });
  //   return arr;
  // };

  // const round = num => {
  //   return Math.round(num * 100) / 100;
  // };

  // const createDataPoints = odds => {
  //   return {
  //     backProfit: null,
  //     backMatched: null,
  //     odds: odds,
  //     layMatched: null,
  //     layProfit: null
  //   };
  // };

  // const createData = () => {
  //   var data = {};

  //   for (var i = 1.01; i < 2; i += 0.01) {
  //     const key = createDataPoints((Math.round(odds * 100) / 100).toFixed(2));
  //     data[key] = key;
  //   }

  //   for (var i = 2; i < 3; i += 0.02) {
  //     const key = createDataPoints((Math.round(odds * 100) / 100).toFixed(2));
  //     data[key] = key;
  //   }
  //   for (var i = 3; i < 3.95; i += 0.05) {
  //     const key = createDataPoints((Math.round(odds * 100) / 100).toFixed(2));
  //     data[key] = key;
  //   }
  //   for (var i = 4; i < 5.99; i += 0.1) {
  //     const key = createDataPoints((Math.round(odds * 100) / 100).toFixed(2));
  //     data[key] = key;
  //   }
  //   for (var i = 6; i < 10; i += 0.2) {
  //     const key = createDataPoints((Math.round(odds * 100) / 100).toFixed(2));
  //     data[key] = key;
  //   }
  //   for (var i = 10; i < 20; i += 0.5) {
  //     const key = createDataPoints((Math.round(odds * 100) / 100).toFixed(2));
  //     data[key] = key;
  //   }
  //   for (var i = 20; i < 30; i += 1) {
  //     const key = createDataPoints((Math.round(odds * 100) / 100).toFixed(2));
  //     data[key] = key;
  //   }
  //   for (var i = 30; i < 50; i += 2) {
  //     const key = createDataPoints((Math.round(odds * 100) / 100).toFixed(2));
  //     data[key] = key;
  //   }
  //   for (var i = 100; i <= 1000; i += 10) {
  //     const key = createDataPoints((Math.round(odds * 100) / 100).toFixed(2));
  //     data[key] = key;
  //   }
  //   return data.reverse();
  // };

  // const Table = () => {
  //   const data = createData();
  //   const rows = renderData(data);

  //   return (
  //     <div className="odds-table">
  //       {renderHeaderRow("5. Nights Fall")}

  //       <div className={"ladder"}>
  //         <table>
  //           <tbody>
  //             {renderPercentageRow("")}
  //             {/* {renderHeaderRow(props.runners[key].runnerName)} */}
  //             {/* {renderPercentageRow(props.ladder[key].ltp)} */}
  //             {rows}
  //             {renderPriceRow()}
  //             {/* {renderPercentageRow("")} */}
  //           </tbody>
  //         </table>
  //       </div>
  //       {renderOrderRow()}
  //     </div>
  //   );
  // };

  const createLadder = () => {
    // return (
    //   <React.Fragment>
    //     <div className={"ass"}>
    //       {Table()}
    //       {Table()}
    //       {Table()}
    //       {Table()}
    //       {Table()}
    //     </div>
    //   </React.Fragment>
    // );

    return Object.keys(props.ladder).map(key => {
      const ladder = props.ladder[key].fullLadder;
      const ltp = props.ladder[key].ltp;

      return (
        <div className="odds-table">
          {renderHeaderRow("5. Nights Fall")}

          <div className={"ladder"}>
            <table>
              <tbody>
                {renderPercentageRow(ltp)}
                {/* {renderHeaderRow(props.runners[key].runnerName)} */}
                {/* {renderPercentageRow(props.ladder[key].ltp)} */}
                {renderData(ladder)}
                {renderPriceRow()}
                {/* {renderPercentageRow("")} */}
              </tbody>
            </table>
          </div>
          {renderOrderRow()}
        </div>
      );

      // if (props.ladder[key].trd) {
      //   const fullLadder = sortDes(props.ladder[key].trd);

      //   return (
      //     <div className="odds-table">
      //       <table className={"ladder"}>
      //         <tbody>
      //           {renderHeaderRow(props.runners[key].runnerName)}
      //           {renderPercentageRow(props.ladder[key].ltp)}
      //           {renderTableData(tradedLadder)}
      //           {renderPriceRow()}
      //           {renderOrderRow()}
      //         </tbody>
      //       </table>
      //     </div>
      //   );
      // }
    });
  };

  const renderHeaderRow = name => {
    return (
      <div colspan={5} className={"ladder-header"}>
        <h2 className="contender-name">{name}</h2>
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
