import React, { useEffect, useState } from "react";
import getQueryVariable from "../utils/Market/GetQueryVariable";
import BetsPlaced from "./ClosedMarketView/BetsPlaced";
import ClosedMarketReport from './ClosedMarketView/ClosedMarketReport';
import MarketSettlement from "./ClosedMarketView/MarketSettlement";

const GetClosedMarketStats = () => {
    const [completedOrders, setCompletedOrders] = useState([]);
    const [runners, setRunners] = useState([]);
    const [marketInfo, setMarketInfo] = useState({});
    const marketId = getQueryVariable("marketId");

    useEffect(() => {

        const getMarketInfo = async () => {
            await fetch(`/api/list-market-book?marketId=${marketId}`)
                .then(res => res.json())
                .then(async data => {
                    if (!data || !data.response.result || (data.response.result[0] && data.response.result[0].status !== "CLOSED")) {
                        window.location.href = window.location.origin + '/dashboard';
                    } else {
                        const currentOrders = await fetch(`/api/listCurrentOrders?marketId=${marketId}`).then(res => res.json()).then(res => res.currentOrders);
                        const completedOrders = currentOrders.filter(order => order.status === "EXECUTION_COMPLETE");
                        setCompletedOrders(completedOrders);

                        const marketBook = data.response.result[0];

                        // take the runner status from the marketBook and add it to the runnerResults
                        const runnersStatusObject = {} // selectionId: status
                        marketBook.runners.forEach(item => {
                            runnersStatusObject[item.selectionId] = item.status;
                        });

                        let runnerResults = await fetch(`/api/fetch-runner-names?marketId=${marketId}`).then(res => res.json()).catch(err => {
                            window.location.href = window.location.origin + '/dashboard';
                        });
                        const marketInfoRunners = Object.keys(runnerResults).map(key => ({ selectionId: key, runnerName: runnerResults[key] }));

                        const runnersWithStatusArray = marketInfoRunners.map(item => {
                            return Object.assign({}, item, { status: runnersStatusObject[item.selectionId] });
                        });

                        setRunners(runnersWithStatusArray);
                    }
                });

            await fetch(`/api/get-market-info?marketId=${marketId}`)
                .then(res => res.json())
                .then(async data => {
                    if (!data || data.error || !data.response.result || !data.response.result[0]) {
                        window.location.href = window.location.origin + '/dashboard';
                    } else {
                        setMarketInfo(data.result[0]);
                    }
                });
        }
        getMarketInfo();
    }, []);

    return (
        <div className={"marketstats-container"}>
            <MarketSettlement marketInfo={marketInfo} />
            <div className={"marketstats-tables"}>
                <ClosedMarketReport matchedBets={completedOrders} runners={runners ? runners : []} />
                <BetsPlaced matchedBets={completedOrders} runners={runners ? runners : []} />
            </div>
        </div>
    )
}

export default GetClosedMarketStats;