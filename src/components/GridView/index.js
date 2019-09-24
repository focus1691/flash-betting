import React, { createRef } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/market";
import { sortAsc, sortDes } from "../../utils/Sort";
import GridHeader from "./GridHeader";
import GridDetailSuspCell from "./GridDetailSuspCell";
import GridDetailCell from "./GridDetailCell";

const Grid = props => {
  const oneClickRef = createRef();

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
    if (!betOdds) return Array(4).fill(createCell("", "", key, backLay));

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
        onMouseEnter={e => {
          console.log("mouse enter");
        }}
        OnMouseLeave={e => {
          console.log("mouse leave");
        }}
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
            <GridDetailCell
              runner={props.runners[key]}
              name={props.runners[key].runnerName}
              number={
                props.runners[key].metadata.CLOTH_NUMBER
                  ? props.runners[key].metadata.CLOTH_NUMBER + ". "
                  : ""
              }
              logo={
                props.runners[key].metadata.COLOURS_FILENAME
                  ? `https://content-cache.cdnbf.net/feeds_images/Horses/SilkColours/${props.runners[key].metadata.COLOURS_FILENAME}`
                  : `${window.location.origin}/images/baseball-player.png`
              }
              selectRunner={e => {
                props.onSelectRunner(props.runners[key]);
              }}
              ltp={ltp}
              tv={tv}
              bg={
                ltp[0] < ltp[1] // #0AFD03 (Green Lower LTP)
                  ? "#0AFD03"
                  : ltp[0] > ltp[1] // #FC0700 (Red Higher LTP)
                  ? "#FC0700"
                  : ltp[0] === ltp[1] // #FFFF00 (Yellow Same LTP)
                  ? "#FFFF00"
                  : "#FFF" // #FFF (No Value)
              }
            />
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

  const renderSuspended = () => {
    return Object.keys(props.ladder).map(key => {
      return (
        <tr>
          <GridDetailSuspCell
            runner={props.runners[key]}
            selectRunner={e => {
              props.onSelectRunner(props.runners[key]);
            }}
          />
          {Array(10).fill(<td></td>)}
        </tr>
      );
    });
  };

  return (
    <div id="grid-container">
      <table
        style={props.marketStatus === "SUSPENDED" ? { opacity: 0.75 } : {}}
        className={"grid-view"}
      >
        <p
          style={props.marketStatus !== "SUSPENDED" ? { display: "none" } : {}}
          id="suspended-message"
        >
          {props.marketStatus}
        </p>
        <tbody>
          <GridHeader
            event={props.market.event}
            ladder={props.ladder}
            marketOpen={props.marketOpen}
            status={props.marketStatus}
            country={{
              localeCode: props.localeCode,
              countryCode: props.countryCode
            }}
            oneClickRef={oneClickRef}
            oneClickOn={props.oneClickOn}
            toggleOneClick={e => {
              props.onToggleOneClick(!props.oneClickOn);
              const node = oneClickRef.current;
              props.oneClickOn ? node.blur() : node.focus();
            }}
          />
          {props.marketOpen
            ? props.marketStatus === "OPEN"
              ? renderTableData()
              : props.marketStatus === "SUSPENDED"
              ? renderSuspended()
              : null
            : null}
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
    marketStatus: state.market.status,
    market: state.market.currentMarket,
    ladder: state.market.ladder,
    runners: state.market.runners,
    countryCode: state.account.countryCode,
    currencyCode: state.account.currencyCode,
    localeCode: state.account.localeCode
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
