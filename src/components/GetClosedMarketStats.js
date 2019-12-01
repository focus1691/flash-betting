import React, { useState, useEffect } from "react";
import getQueryVariable from "../utils/Market/GetQueryVariable";
import MarketSettlement from "./ClosedMarketView/MarketSettlement";
import ClosedMarketReport from './ClosedMarketView/ClosedMarketReport'
import BetsPlaced from "./ClosedMarketView/BetsPlaced";

const GetClosedMarketStats = () => {
    const [completedOrders, setCompletedOrders] = useState([]);
    const [marketInfo, setMarketInfo] = useState({});
    const [runners, setRunners] = useState([]);
    const marketId = getQueryVariable("marketId");
    
    useEffect(() => {
        const getMarketInfo = async () => {
            // await loadSession();
            
            const marketBook = await fetch(`/api/list-market-book?marketId=${marketId}`).then(res => res.json());
            if (!marketBook || !marketBook.response.result || (marketBook.response.result[0] && marketBook.response.result[0].status !== "CLOSED")) {
                window.location.href = window.location.origin + '/dashboard'
            }            

            const currentOrders = await fetch(`/api/listCurrentOrders?marketId=${marketId}`).then(res => res.json()).then(res => res.currentOrders);
            const completedOrders = currentOrders.filter(order => order.status === "EXECUTION_COMPLETE")
            setCompletedOrders(completedOrders)

            const marketInfo = await fetch(`/api/get-market-info?marketId=${marketId}`).then(res => res.json()).then(res => res.response.result[0])
            setMarketInfo(marketInfo)

            // take the runner status from the marketBook and add it to the marketInfo runners
            if (marketBook.response && marketBook.response.result && marketBook.response.result[0].runners) {
                const runnersStatusObject = {} // selectionId: status
                marketBook.response.result[0].runners.map(item => {
                    runnersStatusObject[item.selectionId] = item.status;
                })

                const runnersWithStatusArray = marketInfo.runners.map(item => {
                    return Object.assign({}, item, {status: runnersStatusObject[item.selectionId]})
                })
                setRunners(runnersWithStatusArray);
            }
            

        }
        getMarketInfo();
    }, []);

    return (
        <div className={"marketstats-container"}>
            <MarketSettlement marketInfo = {marketInfo} />
            <div className={"marketstats-tables"}>
                <ClosedMarketReport matchedBets = {completedOrders} runners = {runners ? runners : []}/>
                <BetsPlaced matchedBets = {completedOrders} runners = {runners ? runners : []}/>
            </div>
        </div>
    )
}

export default GetClosedMarketStats;
