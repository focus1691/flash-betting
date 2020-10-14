import React from 'react';
import { connect } from 'react-redux';
import { updateExcludedLadders, updateLadderOrder } from '../../../actions/market';

const Ladder = ({
  marketOpen, ladder, sortedLadder, runners, excludedLadders, ladderOrder, updateExcludedLadders, updateLadderOrder,
}) => {
  const deconstructLadder = (ladder) => {
    if (ladder === undefined) return {};

    const data = {
      ltp: null,
      color: '#FFFFFF',
    };

    if (ladder.ltp && ladder.ltp[0]) {
      data.ltpStyle = ladder.ltp[0] < ladder.ltp[1]
        ? { background: '#FC0700', color: '#FFFF00' } // #FC0700 (Red Lower LTP)
        : ladder.ltp[0] > ladder.ltp[1]
          ? { background: '#0AFD03', color: '#000' } // #0AFD03 (Green Higher LTP)
          : ladder.ltp[0]
            ? { background: '#FFFF00', color: '#000' } // #FFFF00 (Yellow Same LTP)
            : { background: '#FFF', color: '#000' }; // #FFF (No Value)
      data.ltp = ladder.ltp[0];
    }

    data.atb = ladder.atb && ladder.atb[0] ? ladder.atb[0][0] : null;
    data.atl = ladder.atl && ladder.atl[0] ? ladder.atl[0][0] : null;

    return data;
  };

  const handleRunnerSelection = (selectionId) => (e) => {
    if (Object.keys(ladderOrder).length > 0) {
      // we send it to the end when we select a new ladder

      const newLadderOrder = Object.values(ladderOrder).filter((item) => item !== selectionId).concat(selectionId);
      // convert it back to an object
      const newLadderOrderObject = {};
      newLadderOrder.map((item, index) => {
        newLadderOrderObject[index] = item;
      });
      updateLadderOrder(newLadderOrderObject);
    }

    if (excludedLadders.indexOf(selectionId) === -1) {
      updateExcludedLadders(excludedLadders.concat(selectionId));
    } else {
      updateExcludedLadders(excludedLadders.filter((item) => item !== selectionId));
    }
  };

  const renderRunners = () => sortedLadder.map((selectionId) => {
    const {
      atb, atl, ltp, ltpStyle,
    } = deconstructLadder(ladder[selectionId]);
    return (
      <tr key={`sidebar-ladder${runners[selectionId].runnerName}`}>
        <td>{runners[selectionId].runnerName}</td>
        <td>{atl}</td>
        <td style={ltpStyle}>{ltp}</td>
        <td>{atb}</td>
        <td>
          <input
            type="checkbox"
            checked={excludedLadders.indexOf(selectionId) === -1} // false automatically omits attribute
            onChange={handleRunnerSelection(selectionId)}
          />
        </td>
      </tr>
    );
  });

  return (
    <>
      {marketOpen ? (
        <table id="menu-ladder">
          <tbody>{renderRunners()}</tbody>
        </table>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  ladder: state.market.ladder,
  sortedLadder: state.market.sortedLadder,
  runners: state.market.runners,
  excludedLadders: state.market.excludedLadders,
  ladderOrder: state.market.ladderOrder,
});

const mapDispatchToProps = { updateExcludedLadders, updateLadderOrder };

export default connect(mapStateToProps, mapDispatchToProps)(Ladder);