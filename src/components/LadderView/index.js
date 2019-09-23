import React, { useRef } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/order";
import * as actions2 from "../../actions/market";
import LadderHeader from "./LadderHeader";
import LadderBody from "./LadderBody";
import PercentageRow from "./PercentageRow";
import PriceRow from "./PriceRow";
import OrderRow from "./OrderRow";

const Ladders = props => {
  const tableRef = useRef(null);

  return (
    <div className={"ladder-container"}>
      {props.marketOpen && props.ladder
        ? Object.keys(props.ladder).map(key => {
            return (
              <div className="odds-table">
                <LadderHeader
                  runner={props.runners[key]}
                  runnerClick={e => {
                    props.onSelectRunner(props.runners[key]);
                  }}
                />

                <div className={"ladder"}>
                  <table ref={tableRef}>
                    <tbody>
                      <PercentageRow
                        ltp={props.ladder[key].ltp}
                        tv={
                          props.ladder[key].tv[0]
                            ? props.ladder[key].tv[0].toLocaleString()
                            : ""
                        }
                      />
                      <LadderBody
                        ladder={props.ladder[key].fullLadder}
                        selectionId={key}
                        placeOrder={data => {
                          props.onPlaceOrder({
                            marketId: props.market.marketId,
                            side: data.side,
                            size: 5,
                            price: data.price,
                            selectionId: data.selectionId
                          });
                        }}
                      />
                      <PriceRow />
                    </tbody>
                  </table>
                </div>
                <OrderRow />
              </div>
            );
          })
        : null}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currentEvent: state.sports.currentSport.currentEvent,
    marketOpen: state.market.marketOpen,
    market: state.market.currentMarket,
    runners: state.market.runners,
    ladder: state.market.ladder,
    bets: state.order.bets
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectRunner: runner => dispatch(actions2.setRunner(runner)),
    onPlaceOrder: order => dispatch(actions.placeOrder(order))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ladders);
