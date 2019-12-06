import React from "react";
import Loader from 'react-loader-spinner';

export default (() => {
    return (
        <div id="spinner">
            <Loader
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
            />
        </div>
    );
});