import React from "react";
import GridDetailSuspCell from "./GridDetailSuspCell";

export default ({ladder, runners, selectRunner}) => {
    return Object.keys(ladder).map(key => {
        return (
            <tr>
                <GridDetailSuspCell
                    name={runners[key].runnerName}
                    number={runners[key].metadata.CLOTH_NUMBER}
                    logo={runners[key].metadata.COLOURS_FILENAME}
                    onSelectRunner={e => {
                        selectRunner(runners[key]);
                        // props.onSelectRunner(runners[key]);
                    }}
                />
                {Array(10).fill(<td></td>)}
            </tr>
        );
    });
};