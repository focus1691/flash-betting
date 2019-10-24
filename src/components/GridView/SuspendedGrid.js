import React from "react";
import GridDetailSuspCell from "./GridDetailSuspCell";
import { DeconstructRunner } from "../../utils/DeconstructRunner";

export default ({ladder, runners, selectRunner, eventId}) => {
    return Object.keys(ladder).map(key => {
        const { name, number, logo } = DeconstructRunner(runners[key], eventId);
        return (
            <tr>
                <GridDetailSuspCell
                    name={name}
                    number={number}
                    logo={logo}
                    onSelectRunner={e => {
                        selectRunner(runners[key]);
                    }}
                />
                {Array(10).fill(<td></td>)}
            </tr>
        );
    });
};