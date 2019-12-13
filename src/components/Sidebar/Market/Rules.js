import parse from 'html-react-parser';
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

const Rules = props => {

    const [rules, setRules] = useState(null);

    useEffect(() => {
        if (props.market.description) {
            setRules(props.market.description.rules);
        }
    }, [props.market]);

    return (
        <div>
            {rules ? parse(rules.toString()) : null}
        </div>
    );
};

const mapStateToProps = state => {
    return {
      market: state.market.currentMarket,
      marketOpen: state.market.marketOpen,
      selection: state.market.runnerSelection
    };
  };
  
  export default connect(mapStateToProps)(Rules);
  