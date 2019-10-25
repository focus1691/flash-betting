import React from "react";

export default ({ marketStatus }) => (
    <p
        style={marketStatus !== "SUSPENDED" ? { display: "none" } : {}}
        id="suspended-message"
    >
        {marketStatus}
    </p>
);