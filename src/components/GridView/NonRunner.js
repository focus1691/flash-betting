import React from "react";
import GridDetailSuspCell from "./GridDetailSuspCell";

export default ({nonRunners, runners, selectRunner}) => {
    return Object.keys(nonRunners).map(key => {
        return (
            <tr className={"grid-non-runner"}>
                <GridDetailSuspCell
                    name={runners[key].runnerName}
                    number={runners[key].metadata.CLOTH_NUMBER}
                    logo={runners[key].metadata.COLOURS_FILENAME}
                    onSelectRunner={e => {
                        selectRunner(runners[key]);
                    }}
                />
                {Array(10).fill(<td></td>)}
            </tr>
        );
    });
};