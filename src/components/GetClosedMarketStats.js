import React, { useState, useEffect } from "react";
import { connect } from 'react-redux'
import getQueryVariable from "../utils/GetQueryVariable";
import MarketSettlement from "./ClosedMarketView/MarketSettlement";
import ClosedMarketReport from './ClosedMarketView/ClosedMarketReport'
import BetsPlaced from "./ClosedMarketView/BetsPlaced";


const GetClosedMarketStats = () => {
    const [matchedBets, getMatchedBets] = useState([]);
    const marketId = getQueryVariable("marketId");

    const loadSession = async () => {
        /**
         * Send the session key to the server to login to BetFair
         */
        let sessionKey = localStorage.getItem("sessionKey");
        let email = localStorage.getItem("username");
        await fetch(
          `/api/load-session?sessionKey=${encodeURIComponent(
            sessionKey
          )}&email=${encodeURIComponent(email)}`
        );
        
    };
    
    useEffect(() => {
        const getBets = async () => {
            await loadSession();
            // this isn't being called
            const currentOrders = await fetch(`/api/listCurrentOrders?marketId=${marketId}`).then(res => res.json()).then(res => res.currentOrders);
            console.log(currentOrders)
            
            
        }
        getBets();
    }, []);

    return (
        <div style={{padding: '2%'}}>
            <MarketSettlement />
            <div style={{width: '100%', height: '60%', marginTop: '1.5%', display: 'flex', justifyContent: 'space-between'}}>
                <ClosedMarketReport />
                <BetsPlaced matchedBets = {matchedBets} />
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

