import React from "react";
import { connect } from "react-redux";

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
            <img
              src={window.location.origin + "/icons/checked.png"}
              alt={"Matched"}
            />
            <span>
              Matched:{" "}
              {props.marketOpen ? `£${props.market.totalMatched}` : null}
            </span>
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
	
    for (i = rows.length - 5; i > 0; i--) {
      rows.push(createCell("", ""));
    }

    return rows;
  };

  const test = (e, td) => {};

  const createCell = (odds, matched) => {
    return (
      <td className="grid-cell">
        <span>{odds}</span>
        <span>{Math.floor(matched)}</span>
      </td>
    );
  };

  const renderTableData = () => {
    return Object.keys(props.ladder).map(key => {
      const { atb, atl, batb, batl, ltp, tv } = getLadderData(
        props.ladder[key]
      );

      return (
        <tr>
          <td className="grid-runner-details">
            <img
              src={window.location.origin + "/images/00077962.jpg"}
              alt={"Chart"}
            />
            <span>{props.runners[key].runnerName}</span>
            <span>{ltp}</span>
            <span>{}</span>
            <span>{Math.floor(tv)}</span>
          </td>

          {renderRow(atb, batb).reverse()}
          {renderRow(atl, batl)}
        </tr>
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
    runners: state.market.runners
  };
};

export default connect(mapStateToProps)(Grid);
