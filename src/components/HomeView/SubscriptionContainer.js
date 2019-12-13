import React from 'react';

export default ({plan='Monthly', price=9.99, color='gray', openPremiumMenu, setSelectedPremium}) => {
    return (
        <div className = {"subscription-container"}>
            <div className = {"subscription-header"} style={color === "green" ? {backgroundColor: '#26C281'} : null}>
              {plan}
            </div>
            <p className = {"subscription-price"}>£{price}</p>
            <p className = {"subscription-text"}>per month</p>
            <button className = {`subscription-button subscription-${color}-button`} onClick = {() => {openPremiumMenu(true); setSelectedPremium(plan.toLowerCase())}}>
                SIGN UP
            </button>
        </div>
    )
}
