import { isEmpty } from 'lodash';
import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
//* Actions
import { updateExcludedLadders, updateLadderOrder } from '../../../redux/actions/ladder';
//* JSS
import useStyles from '../../../jss/components/Sidebar/market/ladderStyle';

const Ladder = ({ marketOpen, ladder, sortedLadder, runners, excludedLadders, ladderOrder, updateExcludedLadders, updateLadderOrder }) => {
  const styles = useStyles();
  const deconstructLadder = (ladder) => {
    if (isEmpty(ladder)) return {};

    const data = {
      ltp: ladder.ltp,
      atb: ladder.atb && ladder.atb[0] ? ladder.atb[0][0] : null,
      atl: ladder.atl && ladder.atl[0] ? ladder.atl[0][0] : null,
    };
    return data;
  };

  const handleRunnerSelection = (selectionId) => (e) => {
    if (Object.keys(ladderOrder).length > 0) {
      // we send it to the end when we select a new ladder

      const newLadderOrder = Object.values(ladderOrder)
        .filter((item) => item !== selectionId)
        .concat(selectionId);
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

  const renderRunners = () =>
    sortedLadder.map((selectionId) => {
      const { atb, atl, ltp } = deconstructLadder(ladder[selectionId]);
      const runnerName = runners[selectionId] ? runners[selectionId].runnerName : '';
      return (
        <tr key={`sidebar-ladder${runnerName}`}>
          <td>{runnerName}</td>
          <td>{atl}</td>
          <td
            className={clsx(styles.ltp, {
              [styles.ltpEqual]: !isEmpty(ltp[0]) && !isEmpty(ltp[1]) && ladder.ltp[0] === ladder.ltp[1],
              [styles.ltpIncrease]: !isEmpty(ltp[0]) && !isEmpty(ltp[1]) && ladder.ltp[0] > ladder.ltp[1],
              [styles.ltpDecrease]: !isEmpty(ltp[0]) && !isEmpty(ltp[1]) && ladder.ltp[0] < ladder.ltp[1],
            })}
          >
            {ltp}
          </td>
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
        <table className={styles.ladder}>
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
  excludedLadders: state.ladder.excludedLadders,
  ladderOrder: state.ladder.ladderOrder,
});

const mapDispatchToProps = { updateExcludedLadders, updateLadderOrder };

export default connect(mapStateToProps, mapDispatchToProps)(Ladder);
