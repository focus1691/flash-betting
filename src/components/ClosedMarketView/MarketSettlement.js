import React from 'react';
import { IsEmpty } from "react-lodash";

export default({marketInfo}) => {
    const createdAt = new Date(Date.now()).toLocaleString('en-GB', { timeZone: 'UTC' });

    const renderMarketStartTime = isEmpty => e => {
        if (isEmpty) return "";
        else {
            const marketDetails = `${new Date(marketInfo.marketStartTime).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })} ${marketInfo.marketName} ${marketInfo.event.venue}`;
            return (
                <p className={"marketstats-info-marketName"}>{marketDetails}</p>
            );
        }
    }

    return (
        <div style={{ width: '100%', height: '30%' }}>
            <div className={"marketstats-title"}>
                Sports Trading App Market Settlement
            </div>
            <div className={"marketstats-info-container"}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <IsEmpty
                        value={marketInfo}
                        yes={renderMarketStartTime(true)}
                        no={renderMarketStartTime(false)}
                    />
                    <em className={"marketstats-info-created-at"}>Created {createdAt} (commission not included)</em>
                </div>

                <a href={`${window.location.origin}/dashboard`} className={"marketstats-info-back-button"}>
                    Back To Dashboard →
                </a>
            </div>
        </div>
    )
}