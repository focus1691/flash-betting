import React from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/market";

const Grid = props => {
  const renderTableHeader = () => {
    return (
      <React.Fragment>
        <tr id="grid-header">
          <th colSpan="11">
            <span>Turn One click on</span>
            <img
              src={window.location.origin + "/icons/video-player.png"}
              alt={"Video"}
            />
            <h1>
              {props.marketOpen
                ? new Date(props.market.event.openDate).toLocaleTimeString() +
                  " " +
                  props.market.event.name
                : "No Event Selected"}
            </h1>
            <span>Going in-play</span>
            {props.marketOpen ? (
              <img
                src={window.location.origin + "/icons/checked.png"}
                alt={"active"}
              />
            ) : (
              <img
                src={window.location.origin + "/icons/error.png"}
                alt={"inactive"}
              />
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

  const renderRow = (betOdds, bestOdds) => {
    const rows = [];
    for (var i = 0; i < betOdds.length; i++) {
      rows.push(createCell(betOdds[i][0], betOdds[i][1]));
      if (i === 4) break;
    }
    while (rows.length < 5) {
      rows.push(createCell("", ""));
    }

    return rows;
  };

  const test = (e, td) => {};

  const createCell = (odds, matched) => {
    return (
      <td className="grid-cell">
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

      return (
        <React.Fragment>
          <tr>
            <td
              className="grid-runner-details"
              onClick={e => {
                props.onSelectRunner(props.runners[key].metadata);
              }}
            >
              <img src={logo} alt={"Chart"} />
              <span>{`${number}${name}`}</span>
              <span style={{ background: bg }}>{ltp[0] ? ltp[0] : ""}</span>
              <span>{}</span>
              <span>{tv[0] ? Math.floor(tv[0]).toLocaleString() : ""}</span>
            </td>

            {renderRow(atb, batb).reverse()}
            {renderRow(atl, batl)}
          </tr>
          {/* <tr>
            <td colSpan={11}>
              <ul className={"grid-order-row"}>
                <button>STAKE</button>
                <button>2</button>
                <button>4</button>
                <button>6</button>
                <button>8</button>
                <button>10</button>
                <button>12</button>
                <button>14</button>
                <button>0</button>

                <button>Submit</button>

                <img
                  src={window.location.origin + "/icons/error.png"}
                  alt={"Close"}
                  onClick={() => {
                    
                  }}
                />
              </ul>
            </td>
          </tr> */}
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
    onSelectRunner: runner => dispatch(actions.setRunner(runner))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);
