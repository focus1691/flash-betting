import React from "react";
import GridPriceRow from "./GridPriceRow";

export default ({ name, runnerId, order, orderProps, toggleStakeAndLiability, toggleBackAndLay, updateOrderValue, updateOrderPrice, updateOrderVisibility }) => {
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

                        <GridPriceRow
                            name={name}
                            runnerId={runnerId}
                            orderProps={orderProps}
                            onUpdateOrderValue={stake => {
                                updateOrderValue({
                                    id: runnerId,
                                    stake: stake
                                });
                            }}
                        />
                        <span
                            className={"toggle-back-lay"}
                            onClick={() => {
                                let backLay = order.backLay === 0 ? 1 : 0;
                                toggleBackAndLay({ id: runnerId, backLay: backLay });
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

                        <button className={"execute-order-btn"}>Submit</button>

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