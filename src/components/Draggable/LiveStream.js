import React from "react";
import { connect } from "react-redux";
import { openLiveStream } from "../../actions/draggable";

const LiveStream = ({market, open, openLiveStream}) => {
	return market && open ? (
		<div className={"popup-live-stream"}>
			<div>
				<img
					alt={"Close"}
					className={"close-popup-graph"}
					src={`${window.location.origin}/icons/error.png`}
					onClick={openLiveStream}
				/>
			</div>
			<iframe
				src={`https://videoplayer.betfair.com/GetPlayer.do?tr=1&mID=${market.marketId}&allowPopup=false`}
				width="500px"
				height="500px"
				frameBorder="0"
				allow="autoplay; encrypted-media"
				title="video"
			/>
		</div>
	) : null;
};

const mapStateToProps = state => {
	return {
		market: state.market.currentMarket,
		open: state.draggable.liveStreamOpen
	};
};

const mapDispatchToProps = { openLiveStream };

export default connect(mapStateToProps, mapDispatchToProps)(LiveStream);