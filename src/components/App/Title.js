import React from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

const Title = props => {
    return (
        props.marketOpen ? (
            <Helmet>
                <title>
                    {`${new Date(
                        props.market.marketStartTime
                    ).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })} ${props.market.marketName}  ${
                        props.market.event.venue || ""
                        }`}
                </title>
            </Helmet>
        ) : null
    );
};

const mapStateToProps = state => {
    return {
        market: state.market.currentMarket,
        marketOpen: state.market.marketOpen
    };
};

export default connect(mapStateToProps)(Title);