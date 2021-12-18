import { isEmpty } from 'lodash';
import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
//* Actions
import { updateExcludedLadders, updateLadderOrder } from '../../../redux/actions/ladder';
//* Utils
import { DeconstructLadder } from '../../../utils/ladder/DeconstructLadder';
//* JSS
import useStyles from '../../../jss/components/Sidebar/market/ladderStyle';

const Ladder = ({ marketOpen, ladder, sortedLadder, runners, excludedLadders, ladderOrder, updateExcludedLadders, updateLadderOrder }) => {
  const styles = useStyles();

  const handleRunnerSelection = (selectionId) => () => {
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
      const { atb, atl, ltp, ltpPrev } = DeconstructLadder(ladder[selectionId]);
      const runnerName = runners[selectionId] ? runners[selectionId].runnerName : '';
      const isSelected = excludedLadders.indexOf(selectionId) === -1;
      return (
        <tr key={`sidebar-ladder${runnerName}`}>
          <td>{runnerName}</td>
          <td>{atl && atl[0] ? atl[0][0] : null}</td>
          <td
            className={clsx(styles.ltp, {
              [styles.ltpEqual]: !isEmpty(ltpPrev) && ltp === ltpPrev,
              [styles.ltpIncrease]: !isEmpty(ltpPrev) && ltp > ltpPrev,
              [styles.ltpDecrease]: !isEmpty(ltpPrev) && ltp < ltpPrev,
            })}
          >
            {ltp}
          </td>
          <td>{atb && atb[0] ? atb[0][0] : null}</td>
          <td>
            <input
              type="checkbox"
              checked={isSelected}
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
