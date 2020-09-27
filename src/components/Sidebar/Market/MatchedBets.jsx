import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { calcBackProfit, twoDecimalPlaces } from '../../../utils/Bets/BettingCalculations';
import { combinePartiallyMatchedBets } from '../../../utils/Bets/CombineUnmatchedOrders';

const MatchedBets = ({ marketOpen, market, bets }) => {
  const selections = useMemo(() => combinePartiallyMatchedBets(bets), [bets]);

  return (
    <div>
      <table className="menu-bets">
        <tbody>
          <tr className="menu-bets-heading">
            <td>
              <button
                style={{
                  height: '22px',
                  width: 'auto',
                  backgroundColor: 'transparent',
                  visibility: 'collapse',
                  pointerEvents: 'none',
                }}
              />
            </td>
            <td>Odds</td>
            <td>Stake</td>
            <td>P/L</td>
          </tr>
          <tr>
            <td className="menu-bets-event" colSpan={4}>
              {market.competition !== undefined ? `${market.marketName} ${market.competition.name}` : null}
            </td>
          </tr>
          {marketOpen
            ? selections.map((selection, idx) => {
              const selectionObject = market.runners.find((runner) => runner.selectionId === selection);
              if (selectionObject === undefined) return null;

              const filteredOrders = Object.values(bets.matched).filter((order) => order.selectionId === selection);
              return (

                <React.Fragment key={`sidebar-matched-bet-${selection}-${idx}`}>
                  <tr className="menu-bets-selection" colSpan={4}>
                    <td>{selectionObject.runnerName}</td>
                  </tr>
                  {
                    filteredOrders.map((order, idx) => {
                      const PL = calcBackProfit(order.size, order.price, order.side === 'BACK' ? 0 : 1);
                      return (
                        <React.Fragment key={`sidebar-matched-bet-filtered-${order.selectionId}-${idx}`}>
                          <tr
                            id="menu-matched-bet"
                            style={{
                              backgroundColor: order.side === 'BACK' ? '#A6D8FF' : '#FAC9D7',
                            }}
                          >
                            <td>
                              <button style={{ height: '22px', width: 'auto', visibility: 'collapse' }} />
                            </td>

                            <td>{twoDecimalPlaces(order.price)}</td>
                            <td>{order.sizeMatched}</td>
                            <td
                              id="pl-style"
                              style={{
                                color:
                                  PL === '0.00'
                                    ? 'black'
                                    : PL > 0
                                      ? 'green'
                                      : 'red',
                              }}
                            >
                              {PL}
                            </td>
                          </tr>

                        </React.Fragment>
                      );
                    })
                  }
                </React.Fragment>

              );
            })
            : null}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  market: state.market.currentMarket,
  bets: state.order.bets,
});

export default connect(mapStateToProps)(MatchedBets);
