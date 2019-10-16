import React from "react";
import { LightenDarkenColor } from "../../utils/ColorManipulator";
import crypto from 'crypto'

export default ({ name, runnerId, order, orderProps, toggleStakeAndLiability, toggleBackAndLay, updateOrderValue, updateOrderPrice, updateOrderVisibility, onPlaceOrder, market, bets, price, side, size }) => {
    return (
        <tr style={{
            background: orderProps.bg
        }}>
            {order.visible ? (
                <td colSpan={11}>
                    <ul
                        className={"grid-order-row"}
                    >
                        <li
                            onClick={() => {
                                let stakeLiability = order.stakeLiability === 0 ? 1 : 0;
                                toggleStakeAndLiability({
                                    id: runnerId,
                                    stakeLiability: stakeLiability
                                });
                            }}
                        >
                            <img
                                src={`${window.location.origin}/icons/change.png`}
                                alt={"Toggle"}
                            />
                            {orderProps.text}
                        </li>

                        {orderProps.prices.map(price => {
                            return (
                                <li
                                    style={{ background: price === order.stake ? LightenDarkenColor(orderProps.bg, -20) : "" }}
                                    onClick={() => {
                                        updateOrderValue({
                                            id: runnerId,
                                            backLay: order.backLay,
                                            stake: price
                                        });
                                    }}
                                >
                                    {price}
                                </li>
                            );
                        })}
                        <span
                            className={"toggle-back-lay"}
                            onClick={() => {
                                toggleBackAndLay({
                                    id: runnerId,
                                    backLay: order.backLay ^ 1
                                });
                            }}
                        >
                            {orderProps.text2}
                        </span>

                        <input
                            type="text"
                            name="stake"
                            value={order.stake}
                            onChange={e => {
                                updateOrderValue({
                                    id: runnerId,
                                    backLay: order.backLay,
                                    stake: e.target.value
                                });
                            }}
                        ></input>
                        <span>@</span>
                        <input
                            type="number"
                            name="price"
                            min="1"
                            max="10000"
                            value={order.price}
                            onChange={e => {
                                updateOrderPrice({
                                    id: runnerId,
                                    price: e.target.value
                                })
                            }}
                        ></input>

                        <button className={"execute-order-btn"}
                            onClick = {() => {
                                const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15)
                                onPlaceOrder({
                                    marketId: market.marketId,
                                    side: side,
                                    size: size,
                                    price: price,
                                    selectionId: runnerId,
                                    customerStrategyRef: referenceStrategyId,
                                    unmatchedBets: bets.unmatchedBets,
                                    matchedBets: bets.matched,
                                })
                            }}
                        >Submit</button>

                        <span className={"grid-img-container"}>
                            <a
                                href={"#"}
                                onClick={() => {
                                    return false;
                                }}
                            >
                                <img
                                    src={window.location.origin + "/icons/error.png"}
                                    alt={"Close"}
                                    onClick={() => {
                                        updateOrderVisibility({
                                            id: runnerId,
                                            visible: false
                                        });
                                    }}
                                />
                            </a>
                        </span>
                    </ul>
                </td>
            ) : null}
        </tr>
    );
}