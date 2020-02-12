import React, { memo } from "react";
import { connect } from "react-redux";
import { getIsLTP, getLTPDelta, getLTP } from "../../../selectors/marketSelector";
import { formatPrice, formatPriceKey } from "../../../utils/ladder/CreateFullLadder";
import { getLTPstyle } from "../../../utils/ladder/DeconstructLadder";

const arePropsEqual = (prevProps, nextProps) => {
	if (nextProps.isMoving) return true;
	else if (nextProps.isLTP !== prevProps.isLTP || nextProps.ltpDelta !== prevProps.ltpDelta) return false;
	return true;
};

const LadderLTPCell = memo(({ price, isLTP, ltp, ltpDelta, pauseLTPScrolling, resumeLTPScrolling }) => {
	const ltpStyle = isLTP ? getLTPstyle(ltp, ltpDelta) : { background: "#BBBBBB" };

	return (
		<div style={ltpStyle} className="td" onMouseEnter={pauseLTPScrolling} onMouseOut={resumeLTPScrolling}>
			{formatPrice(price)}
		</div>
	);
}, arePropsEqual);

const mapStateToProps = (state, { selectionId, price }) => {
	return {
		isLTP: getIsLTP(state.market.ladder, { selectionId: selectionId, price: formatPriceKey(price) }),
		ltp: getLTP(state.market.ladder, { selectionId }),
		ltpDelta: getLTPDelta(state.market.ladder, { selectionId })
	};
};

export default connect(mapStateToProps)(LadderLTPCell);
