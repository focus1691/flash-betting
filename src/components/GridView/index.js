import React, { createRef } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/market";
import { sortAsc, sortDes } from "../../utils/Sort";
import { sumMatchedBets } from "../../utils/PriceCalculator";

const Grid = props => {
  const oneClickRef = createRef();

  const renderTableHeader = () => {
    return (
      <React.Fragment>
        <tr id="grid-header">
          <th colSpan="11">
            <button
              id="one-click-btn"
              ref={oneClickRef}
              onClick={e => {
                props.onToggleOneClick(!props.oneClickOn);
                const node = oneClickRef.current;
                props.oneClickOn ? node.blur() : node.focus();
              }}
            >
              Turn One click on
            </button>
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
            {props.oneClickOn ? (
              <React.Fragment>
                <div id="one-click-stake">
                  <button>Stake</button>
                  <button>2</button>
                  <button>4</button>
                  <button>6</button>
                  <button>8</button>
                  <button>10</button>
                  <button>12</button>
                  <button>14</button>
                </div>
                <br />
                <div id="one-click-liability">
                  <button>Liability</button>
                  <button>5</button>
                  <button>7.50</button>
                  <button>10</button>
                  <button>12.50</button>
                  <button>15</button>
                  <button>17.50</button>
                  <button>20</button>
                </div>
              </React.Fragment>
            ) : null}
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
            <span id="matched-bets">{props.marketOpen ? `Matched: ${sumMatchedBets(props.ladder)}` : null}</span>
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

  const createCell = (odds, matched, key, backLay) => {
    return (
      <td
        className="grid-cell"
        onClick={() => {
          if (!props.oneClickOn) {
            props.onUpdateOrder({
              id: key,
              visible: true,
              backLay: backLay,
              price: odds
            });
          }
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
        props.runners[key].order.stakeLiability === 0
          ? {
              bg: "#DBEFFF",
              text: "STAKE",
              text2: "BACK",
              prices: [2, 4, 6, 8, 10, 12, 14]
            }
          : {
              bg: "#FEE9EE",
              text: "LIABILITY",
              text2: "LAY",
              prices: [5, 7.5, 10, 12.5, 15, 17.5, 20]
            };

      orderProps.text2 =
        props.runners[key].order.backLay === 0 ? "BACK" : "LAY";

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
                  <li
                    onClick={() => {
                      let stakeLiability =
                        props.runners[key].order.stakeLiability === 0 ? 1 : 0;
                      props.onToggleStakeAndLiability({
                        id: key,
                        stakeLiability: stakeLiability
                      });
                    }}
                  >
                    <img
                      src={`${window.location.origin}/icons/change.png`}
                      alt={"Toggle"}
                    />
                    {orderProps.text}
                  </li>
                  <li
                    key={`${orderProps.prices[0]}${name}`}
                    onClick={() => {
                      props.onUpdateOrderValue({
                        id: key,
                        stake: orderProps.prices[0]
                      });
                    }}
                  >
                    {orderProps.prices[0]}
                  </li>
                  <li
                    key={`${orderProps.prices[1]}${name}`}
                    onClick={() => {
                      props.onUpdateOrderValue({
                        id: key,
                        stake: orderProps.prices[1]
                      });
                    }}
                  >
                    {orderProps.prices[1]}
                  </li>
                  <li
                    key={`${orderProps.prices[2]}${name}`}
                    onClick={() => {
                      props.onUpdateOrderValue({
                        id: key,
                        stake: orderProps.prices[2]
                      });
                    }}
                  >
                    {orderProps.prices[2]}
                  </li>
                  <li
                    key={`${orderProps.prices[3]}${name}`}
                    onClick={() => {
                      props.onUpdateOrderValue({
                        id: key,
                        stake: orderProps.prices[3]
                      });
                    }}
                  >
                    {orderProps.prices[3]}
                  </li>
                  <li
                    key={`${orderProps.prices[4]}${name}`}
                    onClick={() => {
                      props.onUpdateOrderValue({
                        id: key,
                        stake: orderProps.prices[4]
                      });
                    }}
                  >
                    {orderProps.prices[4]}
                  </li>
                  <li
                    key={`${orderProps.prices[5]}${name}`}
                    onClick={() => {
                      props.onUpdateOrderValue({
                        id: key,
                        stake: orderProps.prices[5]
                      });
                    }}
                  >
                    {orderProps.prices[5]}
                  </li>
                  <li
                    key={`${orderProps.prices[6]}${name}`}
                    onClick={() => {
                      props.onUpdateOrderValue({
                        id: key,
                        stake: orderProps.prices[6]
                      });
                    }}
                  >
                    {orderProps.prices[6]}
                  </li>
                  <li
                    key={`${0}${name}`}
                    onClick={() => {
                      props.onUpdateOrderValue({ id: key, stake: 0 });
                    }}
                  >
                    0
                  </li>
                  <span
                    className={"toggle-back-lay"}
                    onClick={() => {
                      let backLay =
                        props.runners[key].order.backLay === 0 ? 1 : 0;
                      props.onToggleBackAndLay({ id: key, backLay: backLay });
                    }}
                  >
                    {orderProps.text2}
                  </span>

                  <input
                    type="text"
                    name="stake"
                    value={props.runners[key].order.stake}
                    onChange={e => {
                      props.onUpdateOrderValue({
                        id: key,
                        stake: e.target.value
                      });
                    }}
                  ></input>
                  <span>@</span>
                  <input
                    type="number"
                    name="price"
                    min="1"
                    max="10000"
                    value={props.runners[key].order.price}
                    onChange={e => {
                      props.onUpdateOrderPrice({
                        id: key,
                        price: e.target.value
                      });
                    }}
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
    oneClickOn: state.market.oneClickOn,
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
    onUpdateOrderValue: val => dispatch(actions.updateOrderValue(val)),
    onUpdateOrderPrice: price => dispatch(actions.updateOrderPrice(price)),
    onUpdateOrderVisibility: settings =>
      dispatch(actions.toggleVisibility(settings)),
    onToggleStakeAndLiability: value =>
      dispatch(actions.toggleStakeAndLiability(value)),
    onToggleBackAndLay: value => dispatch(actions.toggleBackAndLay(value)),
    onToggleOneClick: active => dispatch(actions.toggleOneClick(active))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);
