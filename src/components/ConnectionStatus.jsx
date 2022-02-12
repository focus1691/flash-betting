import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { setConnectionErrorMessage } from '../redux/actions/market';
import useStyles from '../jss/components/ConnectionStatus';

const ConnectionStatus = ({ connectionError, setConnectionErrorMessage, marketOpen, marketId, clk, initialClk, socket }) => {
  const styles = useStyles();
  const resubscribe = useCallback(() => {
    if (marketOpen && marketId && initialClk && clk) {
      socket.emit('market-resubscription', { marketId, initialClk, clk });
      setConnectionErrorMessage('');
    }
  }, [clk, initialClk, marketOpen, marketId, socket]);

  return (
    <div className={styles.container} style={{ visibility: connectionError ? 'visible' : 'hidden' }}>
      <p className={styles.text}>{connectionError}</p>
      <button className={styles.resubscribeBtn} type="button" onClick={resubscribe}>
        Resubscribe
      </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  initialClk: state.market.initialClk,
  clk: state.market.clk,
  connectionError: state.market.connectionError,
  marketOpen: state.market.marketOpen,
  marketId: state.market.marketId,
});

const mapDispatchToProps = { setConnectionErrorMessage };

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionStatus);
