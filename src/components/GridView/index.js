import React from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/market";
import classnames from "classnames";

const Grid = props => {
  const renderTableHeader = () => {
    return (
      <React.Fragment>
        <tr id="grid-header">
          <th colSpan="11">
            <button>Turn One click on</button>
            <span className={"grid-video"}>
              {" "}
              <img
                src={window.location.origin + "/icons/youtube.png"}
                alt={"Video"}
              />
            </span>
            <h1>
              {props.marketOpen
                ? new Date(props.market.event.openDate).toLocaleTimeString() +
                  " " +
                  props.market.event.name
                : "No Event Selected"}
            </h1>
            {props.marketOpen ? (
              <div className={"in-play"}>
                <span className={"in-play"}>Going in-play</span>
                <img
                  src={window.location.origin + "/icons/checked.png"}
                  alt={"active"}
                />
              </div>
            ) : (
              <div className={"in-play"}>
                <span>Not Going in-play</span>
                <img
                  src={window.location.origin + "/icons/error.png"}
                  alt={"inactive"}
                />
              </div>
            )}
            <span>{props.marketOpen ? sumMatchedBets() : null}</span>
          </th>
        </tr>
        <tr id="grid-subheader">
          <th>
            <span>Market Cashout</span>
          </th>
          <th colSpan="1"></th>

          <th colSpan="1"></th>
          <th></th>
          <th></th>
          <th>
            <span>Back</span>
          </th>
          <th>
            <span>Lay</span>
          </th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </React.Fragment>
    );
  };
  const getLadderData = ladder => {
    const data = {
      ltp: ladder.ltp,
      tv: ladder.tv
    };

    if (ladder.atb) {
      data.atb = sortDes(ladder.atb);
    }
    if (ladder.atl) {
      data.atl = sortAsc(ladder.atl);
    }
    if (ladder.batb) {
      data.batb = sortDes(ladder.batb);
    }
    if (ladder.batl) {
      data.batl = sortAsc(ladder.batl);
    }

    return data;
  };

  const sumMatchedBets = () => {
    const sum = Object.keys(props.ladder).reduce(
      (sum, key) => sum + parseFloat(props.ladder[key].tv || 0),
      0
    );
    return sum ? `Matched: ${Math.floor(sum).toLocaleString()}` : "";
  };

  const sortDes = arr => {
    if (arr.length <= 0) return [];

    arr = arr.sort(function(a, b) {
      return b[0] - a[0];
    });
    return arr;
  };

  const sortAsc = arr => {
    if (arr.length <= 0) return [];

    arr = arr.sort(function(a, b) {
      return a[0] - b[0];
    });
    return arr;
  };

  const renderRow = (betOdds, bestOdds, key, backLay) => {
    const rows = [];
    for (var i = 0; i < betOdds.length; i++) {
      rows.push(createCell(betOdds[i][0], betOdds[i][1], key, backLay));
      if (i === 4) break;
    }
    while (rows.length < 5) {
      rows.push(createCell("", "", key, backLay));
    }

    return rows;
  };

  const test = (e, td) => {};

  const createCell = (odds, matched, key, backLay) => {
    return (
      <td
        className="grid-cell"
        onClick={() => {
          props.onUpdateOrder({
            id: key,
            visible: true,
            backLay: backLay,
            price: odds
          });
        }}
      >
        <span>{odds}</span>
        <span>{matched}</span>
      </td>
    );
  };

  const renderTableData = () => {
    return Object.keys(props.ladder).map(key => {
      const { atb, atl, batb, batl, ltp, tv } = getLadderData(
        props.ladder[key]
      );

      const name = props.runners[key].runnerName;
      const number = props.runners[key].metadata.CLOTH_NUMBER
        ? props.runners[key].metadata.CLOTH_NUMBER + ". "
        : "";

      const bg =
        ltp[0] < ltp[1] // #0AFD03 (Green Lower LTP)
          ? "#0AFD03"
          : ltp[0] > ltp[1] // #FC0700 (Red Higher LTP)
          ? "#FC0700"
          : ltp[0] === ltp[1] // #FFFF00 (Yellow Same LTP)
          ? "#FFFF00"
          : "#FFF"; // #FFF (No Value)

      const logo = props.runners[key].metadata.COLOURS_FILENAME
        ? `https://content-cache.cdnbf.net/feeds_images/Horses/SilkColours/${props.runners[key].metadata.COLOURS_FILENAME}`
        : `${window.location.origin}/images/baseball-player.png`;

      const orderProps =
        props.runners[key].order.backLay === 0
          ? {
              bg: "#DBEFFF",
              text: "STAKE",
              text2: "BACK"
            }
          : {
              bg: "#FEE9EE",
              text: "LIABILITY",
              text2: "LAY"
            };

      return (
        <React.Fragment>
          <tr>
            <td
              className="grid-runner-details"
              onClick={e => {
                props.onSelectRunner(props.runners[key].metadata);
              }}
            >
              <img src={logo} alt={"Runner"} />
              <span>{`${number}${name}`}</span>
              <span style={{ background: bg }}>{ltp[0] ? ltp[0] : ""}</span>
              <span>{}</span>
              <span>{tv[0] ? Math.floor(tv[0]).toLocaleString() : ""}</span>
            </td>

            {renderRow(atb, batb, key, 0).reverse()}
            {renderRow(atl, batl, key, 1)}
          </tr>
          <tr>
            {props.runners[key].order.visible ? (
              <td colSpan={11}>
                <ul
                  style={{
                    background: orderProps.bg
                  }}
                  className={"grid-order-row"}
                >
                  <li onClick={() => {}}>
                    <img
                      src={`${window.location.origin}/icons/change.png`}
                      alt={"Toggle"}
                    />
                    {orderProps.text}
                  </li>
                  <li key={`${2}${name}`}>2</li>
                  <li key={`${4}${name}`}>4</li>
                  <li key={`${6}${name}`}>6</li>
                  <li key={`${8}${name}`}>8</li>
                  <li key={`${10}${name}`}>10</li>
                  <li key={`${12}${name}`}>12</li>
                  <li key={`${14}${name}`}>14</li>
                  <li key={`${0}${name}`}>0</li>
                  <span>{orderProps.text2}</span>

                  <input type="text" name="stake" value={4}></input>
                  <span>@</span>
                  <input
                    type="number"
                    name="price"
                    min="1"
                    max="10000"
                    value={props.runners[key].order.price}
                  ></input>

                  <button className={"execute-order-btn"}>Submit</button>

                  <span className={"grid-img-container"}>
                    <a
                      href={"#"}
                      onClick={() => {
                        return false;
                      }}
                    >
                      <img
                        src={window.location.origin + "/icons/error.png"}
                        alt={"Close"}
                        onClick={() => {
                          props.onUpdateOrderVisibility({
                            id: key,
                            visible: false
                          });
                        }}
                      />
                    </a>
                  </span>
                </ul>
              </td>
            ) : null}
          </tr>
        </React.Fragment>
      );
    });
  };

  return (
    <div id="grid-container">
      <table className={"grid-view"}>
        <tbody>
          {renderTableHeader()}
          {props.marketOpen ? renderTableData() : null}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currentEvent: state.sports.currentSport.currentEvent,
    marketOpen: state.market.marketOpen,
    market: state.market.currentMarket,
    ladder: state.market.ladder,
    runners: state.market.runners,
    selection: state.market.runnerSelection
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectRunner: runner => dispatch(actions.setRunner(runner)),
    onUpdateRunners: runners => dispatch(actions.loadRunners(runners)),
    onUpdateOrder: order => dispatch(actions.updateOrder(order)),
    onUpdateOrderVisibility: settings =>
      dispatch(actions.toggleVisibility(settings))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);
