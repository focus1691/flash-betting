import React, { useState } from "react";
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default ({ horseRaces, toggleHorseRaces, saveSetting, classes }) => {

    const [changeMade, setChangeMade] = useState(false);

    const renderSaveBtn = () => {
        if (!changeMade) return null;

        return (
            <button
                className={"save-btn"}
                onClick={e => {
                    setChangeMade(false);
                    saveSetting({
                        "settings.horseRaces": {
                            GB: horseRaces.GB, IE: horseRaces.IE, FR: horseRaces.FR, DE: horseRaces.DE,
                            IT: horseRaces.IT, AE: horseRaces.AE, TR: horseRaces.TR, SG: horseRaces.SG, SE: horseRaces.SE,
                            US: horseRaces.US, AU: horseRaces.AU, NZ: horseRaces.NZ, ZA: horseRaces.ZA
                        }
                    });
                }}
            >
                <img alt={"Save"} src={window.location.origin + "/icons/save.png"} />
            </button>
        );
    };

    return (
        <>
            <AppBar className={classes.appBar} position="static">
                <Typography variant="h6" className={classes.title}>
                    Horse Racing
				</Typography>
            </AppBar>
            <FormControlLabel
                control={
                    <Checkbox
                        value="checkedB"
                        color="primary"
                        checked={horseRaces.GB}
                        onChange={e => {
                            setChangeMade(true);
                            toggleHorseRaces({
                                GB: !horseRaces.GB, IE: horseRaces.IE, FR: horseRaces.FR, DE: horseRaces.DE,
                                IT: horseRaces.IT, AE: horseRaces.AE, TR: horseRaces.TR, SG: horseRaces.SG, SE: horseRaces.SE,
                                US: horseRaces.US, AU: horseRaces.AU, NZ: horseRaces.NZ, ZA: horseRaces.ZA
                            })
                        }}
                    />
                }
                label="GB"
            />
            {renderSaveBtn()}
            <FormControlLabel
                control={
                    <Checkbox
                        value="checkedB"
                        color="primary"
                        checked={horseRaces.IE}
                        onChange={e => {
                            setChangeMade(true);
                            toggleHorseRaces({
                                GB: horseRaces.GB, IE: !horseRaces.IE, FR: horseRaces.FR, DE: horseRaces.DE,
                                IT: horseRaces.IT, AE: horseRaces.AE, TR: horseRaces.TR, SG: horseRaces.SG, SE: horseRaces.SE,
                                US: horseRaces.US, AU: horseRaces.AU, NZ: horseRaces.NZ, ZA: horseRaces.ZA
                            })
                        }}
                    />
                }
                label="IRE"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        value="checkedB"
                        color="primary"
                        checked={horseRaces.FR}
                        onChange={e => {
                            setChangeMade(true);
                            toggleHorseRaces({
                                GB: horseRaces.GB, IE: horseRaces.IE, FR: !horseRaces.FR, DE: horseRaces.DE,
                                IT: horseRaces.IT, AE: horseRaces.AE, TR: horseRaces.TR, SG: horseRaces.SG, SE: horseRaces.SE,
                                US: horseRaces.US, AU: horseRaces.AU, NZ: horseRaces.NZ, ZA: horseRaces.ZA
                            })
                        }}
                    />
                }
                label="FR"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        value="checkedB"
                        color="primary"
                        checked={horseRaces.DE}
                        onChange={e => {
                            setChangeMade(true);
                            toggleHorseRaces({
                                GB: horseRaces.GB, IE: horseRaces.IE, FR: horseRaces.FR, DE: !horseRaces.DE,
                                IT: horseRaces.IT, AE: horseRaces.AE, TR: horseRaces.TR, SG: horseRaces.SG, SE: horseRaces.SE,
                                US: horseRaces.US, AU: horseRaces.AU, NZ: horseRaces.NZ, ZA: horseRaces.ZA
                            })
                        }}
                    />
                }
                label="GER"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        value="checkedB"
                        color="primary"
                        checked={horseRaces.IT}
                        onChange={e => {
                            setChangeMade(true);
                            toggleHorseRaces({
                                GB: horseRaces.GB, IE: horseRaces.IE, FR: horseRaces.FR, DE: horseRaces.DE,
                                IT: !horseRaces.IT, AE: horseRaces.AE, TR: horseRaces.TR, SG: horseRaces.SG, SE: horseRaces.SE,
                                US: horseRaces.US, AU: horseRaces.AU, NZ: horseRaces.NZ, ZA: horseRaces.ZA
                            })
                        }}
                    />
                }
                label="IT"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        value="checkedB"
                        color="primary"
                        checked={horseRaces.AE}
                        onChange={e => {
                            setChangeMade(true);
                            toggleHorseRaces({
                                GB: horseRaces.GB, IE: horseRaces.IE, FR: horseRaces.FR, DE: horseRaces.DE,
                                IT: horseRaces.IT, AE: !horseRaces.AE, TR: horseRaces.TR, SG: horseRaces.SG, SE: horseRaces.SE,
                                US: horseRaces.US, AU: horseRaces.AU, NZ: horseRaces.NZ, ZA: horseRaces.ZA
                            })
                        }}
                    />
                }
                label="UAE"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        value="checkedB"
                        color="primary"
                        checked={horseRaces.TR}
                        onChange={e => {
                            setChangeMade(true);
                            toggleHorseRaces({
                                GB: horseRaces.GB, IE: horseRaces.IE, FR: horseRaces.FR, DE: horseRaces.DE,
                                IT: horseRaces.IT, AE: horseRaces.AE, TR: !horseRaces.TR, SG: horseRaces.SG, SE: horseRaces.SE,
                                US: horseRaces.US, AU: horseRaces.AU, NZ: horseRaces.NZ, ZA: horseRaces.ZA
                            })
                        }}
                    />
                }
                label="TUR"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        value="checkedB"
                        color="primary"
                        checked={horseRaces.SG}
                        onChange={e => {
                            setChangeMade(true);
                            toggleHorseRaces({
                                GB: horseRaces.GB, IE: horseRaces.IE, FR: horseRaces.FR, DE: horseRaces.DE,
                                IT: horseRaces.IT, AE: horseRaces.AE, TR: horseRaces.TR, SG: !horseRaces.SG, SE: horseRaces.SE,
                                US: horseRaces.US, AU: horseRaces.AU, NZ: horseRaces.NZ, ZA: horseRaces.ZA
                            })
                        }}
                    />
                }
                label="SGP"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        value="checkedB"
                        color="primary"
                        checked={horseRaces.SE}
                        onChange={e => {
                            setChangeMade(true);
                            toggleHorseRaces({
                                GB: horseRaces.GB, IE: horseRaces.IE, FR: horseRaces.FR, DE: horseRaces.DE,
                                IT: horseRaces.IT, AE: horseRaces.AE, TR: horseRaces.TR, SG: horseRaces.SG, SE: !horseRaces.SE,
                                US: horseRaces.US, AU: horseRaces.AU, NZ: horseRaces.NZ, ZA: horseRaces.ZA
                            })
                        }}
                    />
                }
                label="SWE"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        value="checkedB"
                        color="primary"
                        checked={horseRaces.US}
                        onChange={e => {
                            setChangeMade(true);
                            toggleHorseRaces({
                                GB: horseRaces.GB, IE: horseRaces.IE, FR: horseRaces.FR, DE: horseRaces.DE,
                                IT: horseRaces.IT, AE: horseRaces.AE, TR: horseRaces.TR, SG: horseRaces.SG, SE: horseRaces.SE,
                                US: !horseRaces.US, AU: horseRaces.AU, NZ: horseRaces.NZ, ZA: horseRaces.ZA
                            })
                        }}
                    />
                }
                label="USA"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        value="checkedB"
                        color="primary"
                        checked={horseRaces.AU}
                        onChange={e => {
                            setChangeMade(true);
                            toggleHorseRaces({
                                GB: horseRaces.GB, IE: horseRaces.IE, FR: horseRaces.FR, DE: horseRaces.DE,
                                IT: horseRaces.IT, AE: horseRaces.AE, TR: horseRaces.TR, SG: horseRaces.SG, SE: horseRaces.SE,
                                US: horseRaces.US, AU: !horseRaces.AU, NZ: horseRaces.NZ, ZA: horseRaces.ZA
                            })
                        }}
                    />
                }
                label="AUS"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        value="checkedB"
                        color="primary"
                        checked={horseRaces.NZ}
                        onChange={e => {
                            setChangeMade(true);
                            toggleHorseRaces({
                                GB: horseRaces.GB, IE: horseRaces.IE, FR: horseRaces.FR, DE: horseRaces.DE,
                                IT: horseRaces.IT, AE: horseRaces.AE, TR: horseRaces.TR, SG: horseRaces.SG, SE: horseRaces.SE,
                                US: horseRaces.US, AU: horseRaces.AU, NZ: !horseRaces.NZ, ZA: horseRaces.ZA
                            })
                        }}
                    />
                }
                label="NZ"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        value="checkedB"
                        color="primary"
                        checked={horseRaces.ZA}
                        onChange={e => {
                            setChangeMade(true);
                            toggleHorseRaces({
                                GB: horseRaces.GB, IE: horseRaces.IE, FR: horseRaces.FR, DE: horseRaces.DE,
                                IT: horseRaces.IT, AE: horseRaces.AE, TR: horseRaces.TR, SG: horseRaces.SG, SE: horseRaces.SE,
                                US: horseRaces.US, AU: horseRaces.AU, NZ: horseRaces.NZ, ZA: !horseRaces.ZA
                            })
                        }}
                    />
                }
                label="SA"
            />
        </>
    );
};