import React from "react";
import GridDetailSuspCell from "./GridDetailSuspCell";
import { DeconstructRunner } from "../../utils/Market/DeconstructRunner";

export default ({sportId, nonRunners, runners, selectRunner}) => {
    return Object.keys(nonRunners).map(key => {
        const { logo } = DeconstructRunner(runners[key], sportId);
        return (
            <tr className={"grid-non-runner"}>
                <GridDetailSuspCell
                    sportId={sportId}
                    name={runners[key].runnerName}
                    number={runners[key].metadata.CLOTH_NUMBER}
                    logo={logo}
                    onSelectRunner={selectRunner(runners[key])}
                />
                {Array(10).fill(<td></td>)}
            </tr>
        );
    });
};