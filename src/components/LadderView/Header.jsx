import React, { memo, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';
//* Actions
import { setRunner } from '../../actions/market';
import { setDraggingLadder } from '../../actions/ladder';
//* Selectors
import { getRunner, getSportId, getPL } from '../../selectors/marketSelector';
//* Utils
import { twoDecimalPlaces } from '../../utils/Bets/BettingCalculations';
import { iconForEvent } from '../../utils/Market/EventIcons';
import { getTrainerAndJockey } from '../../utils/Market/DeconstructRunner';
import { calcOddsOnPriceHover } from '../../utils/Bets/HedgeProfit';
import { marketHasBets } from '../../utils/Bets/GetProfitAndLoss';
//* JSS
import useStyles from '../../jss/components/LadderView/headerStyle';

const LadderHeader = memo(({
  marketId, selectionId, sportId, runner, setRunner, setLadderDown, oddsHovered, PL, setDraggingLadder, bets, hedge,
}) => {
  const classes = useStyles();
  const ordersOnMarket = useMemo(() => marketHasBets(marketId, bets), [bets, marketId]);
  const oddsHoveredCalc = useMemo(() => calcOddsOnPriceHover(oddsHovered.odds, oddsHovered.side, selectionId, oddsHovered.selectionId, PL), [
    PL,
    oddsHovered.odds,
    oddsHovered.selectionId,
    oddsHovered.side,
    selectionId,
  ]);

  const handleMouseDown = () => {
    setLadderDown(true);
    setDraggingLadder(selectionId);
  };

  const handleNoImageError = (e) => {
    e.target.onerror = null;
    e.target.src = iconForEvent(parseInt(sportId));
  };

  const runnerSelected = useCallback(() => {
    setRunner(runner);
  }, [runner, setRunner]);

  return (
    <div className={classes.ladderHeader}>
      <div>
        <h2 className={classes.runnerName} onMouseDown={handleMouseDown}>
          {
            <img
              className={classes.runnerIcon}
              src={
                runner.metadata.COLOURS_FILENAME && parseInt(sportId) === 7
                  ? `https://content-cache.cdnbf.net/feeds_images/Horses/SilkColours/${runner.metadata.COLOURS_FILENAME}`
                  : iconForEvent(sportId)
              }
              alt="Colours"
              onClick={runnerSelected}
              onError={handleNoImageError}
            />
          }
          {`${runner.metadata.CLOTH_NUMBER ? `${runner.metadata.CLOTH_NUMBER}. ` : ''}${runner.runnerName}`}
        </h2>
        <div className={classes.runnerContainer}>
          <span
            className={classes.runnerodds}
            style={{
              display: ordersOnMarket ? 'block' : 'none',
              color: PL >= 0 ? '#1ae17d' : '#c13232',
            }}
          >
            {(PL && PL.toFixed(2)) || null}
          </span>
          <div className={classes.runnerDetails}>
            <span>{getTrainerAndJockey(runner)}</span>
          </div>
          <span
            className={classes.runnerodds}
            style={{
              display: oddsHovered.odds > 0 && ordersOnMarket ? 'block' : 'none',
              color: oddsHoveredCalc >= 0 ? '#1ae17d' : '#c13232',
            }}
          >
            {(oddsHoveredCalc && oddsHoveredCalc.toFixed(2)) || null}
          </span>
        </div>
      </div>
      <div>
        <span
          style={{
            display: parseFloat(hedge.profit) === 0 ? 'none' : 'block',
            color: parseFloat(hedge.profit) >= 0 ? '#1ae17d' : '#c13232',
          }}
        >
          {twoDecimalPlaces(hedge.profit)}
        </span>
        <span
          style={{
            display: twoDecimalPlaces(hedge.size) <= 0 ? 'none' : 'block',
            color: hedge.side === 'BACK' ? '#05caf0' : '#d4696b',
          }}
        >
          {(hedge.size && hedge.size.toFixed(2)) || null}
        </span>
      </div>
    </div>
  );
});

const mapStateToProps = (state, { selectionId }) => ({
  marketId: state.market.marketId,
  sportId: getSportId(state.market.eventType),
  runner: getRunner(state.market.runners, { selectionId }),
  oddsHovered: state.ladder.oddsHovered,
  PL: getPL(state.ladder.marketPL, { selectionId }),
  bets: state.order.bets,
});

const mapDispatchToProps = { setRunner, setDraggingLadder };

export default connect(mapStateToProps, mapDispatchToProps)(LadderHeader);
