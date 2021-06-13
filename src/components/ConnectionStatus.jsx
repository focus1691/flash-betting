import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { setConnectionErrorMessage } from '../redux/actions/market';

const ConnectionStatus = ({ connectionError, setConnectionErrorMessage, marketId, clk, initialClk, socket }) => {
  const resubscribe = useCallback(() => {
    if (marketId && initialClk && clk) {
      socket.emit('market-resubscription', { marketId, initialClk, clk });
      setConnectionErrorMessage('');
    }
  }, [clk, initialClk, marketId, socket]);

  return (
    <div className="connectionbug-container" style={{ visibility: connectionError !== '' ? 'visible' : 'hidden' }}>
      <p className="connectionbug-text">{connectionError}</p>
      <button type="button" onClick={resubscribe}>
        Resubscribe
      </button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  initialClk: state.market.initialClk,
  clk: state.market.clk,
  connectionError: state.market.connectionError,
  marketId: state.market.marketId,
});

const mapDispatchToProps = { setConnectionErrorMessage };

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionStatus);
