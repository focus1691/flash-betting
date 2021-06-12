import React, { useCallback } from 'react';
import { connect } from 'react-redux';

const ConnectionStatus = ({ connectionError, setConnectionError, marketId, clk, initialClk, socket }) => {

  const resubscribe = useCallback(() => {
    if (marketId && initialClk && clk) {
      socket.emit('market-resubscription', { marketId, initialClk, clk });
      setConnectionError('');
    }
  }, [clk, initialClk, marketId, setConnectionError, socket]);

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
  marketId: state.market.marketId,
});

export default connect(mapStateToProps)(ConnectionStatus);
