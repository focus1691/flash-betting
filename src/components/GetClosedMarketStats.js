import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { useCookies } from 'react-cookie';
import getQueryVariable from "../utils/Market/GetQueryVariable";
import MarketSettlement from "./ClosedMarketView/MarketSettlement";
import ClosedMarketReport from './ClosedMarketView/ClosedMarketReport'
import BetsPlaced from "./ClosedMarketView/BetsPlaced";

const GetClosedMarketStats = () => {
    const [cookies] = useCookies(['sessionKey', 'username']);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [marketInfo, setMarketInfo] = useState({});
    const marketId = getQueryVariable("marketId");

    const loadSession = async () => {
        await fetch(
          `/api/load-session?sessionKey=${encodeURIComponent(
            cookies.sessionKey
          )}&email=${encodeURIComponent(cookies.email)}`
        );
    };
    
    useEffect(() => {
        const getMarketInfo = async () => {
            // await loadSession();
            
            const marketBook = await fetch(`/api/list-market-book?marketId=${marketId}`).then(res => res.json());
            if (!marketBook || !marketBook.response.result || marketBook.response.result.status !== "CLOSED") {
                window.location.href = window.location.origin + '/dashboard'
            }

            const currentOrders = await fetch(`/api/listCurrentOrders?marketId=${marketId}`).then(res => res.json()).then(res => res.currentOrders);
            const completedOrders = currentOrders.filter(order => order.status === "EXECUTION_COMPLETE")
            setCompletedOrders(completedOrders);

            const marketInfo = await fetch(`/api/get-market-info?marketId=${marketId}`).then(res => res.json()).then(res => res.response.result[0])
            setMarketInfo(marketInfo)
        }
        getMarketInfo();
    }, []);

    return (
        <div className={"marketstats-container"}>
            <MarketSettlement marketInfo = {marketInfo} />
            <div className={"marketstats-tables"}>
                <ClosedMarketReport matchedBets = {completedOrders} runners = {marketInfo.runners ? marketInfo.runners : []}/>
                <BetsPlaced matchedBets = {completedOrders} runners = {marketInfo.runners ? marketInfo.runners : []}/>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        
    }
}

const mapDispatchToProps = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GetClosedMarketStats)

