import React from "react";
import { DeconstructRunner } from "../../utils/Market/DeconstructRunner";
import GridDetailSuspCell from "./GridDetailSuspCell";

export default ({sportId, nonRunners, runners, selectRunner}) => {
    return Object.keys(nonRunners).map(key => {
        const { name, number, logo } = DeconstructRunner(runners[key], sportId);
        return (
            <tr className={"grid-non-runner"} key={"nonrunners-" + key}>
                <GridDetailSuspCell
                    sportId={sportId}
                    name={name}
                    number={number}
                    logo={logo}
                    onSelectRunner={selectRunner(runners[key])}
                />
                {Array(10).fill(<td></td>)}
            </tr>
        );
    });
};