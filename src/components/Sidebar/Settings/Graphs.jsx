import React, { useState } from "react";
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export default ({ graphs, toggleGraph, saveSetting, classes }) => {

    const [changeMade, setChangeMade] = useState(false);

    const renderSaveBtn = () => {
        if (!changeMade) return null;

        return (
			<button
				className={"save-btn"}
                onClick={e => {
                    saveSetting({"settings.graphs": { visible: graphs.visible, open: graphs.open }});
                    setChangeMade(false);
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
					Graphs
				</Typography>
			</AppBar>
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={graphs.visible}
						onChange={e => {
                            setChangeMade(true);
                            toggleGraph({ visible: !graphs.visible, open: graphs.open });
                        }}
					/>
				}
				label="Show Panel"
			/>
            {renderSaveBtn()}
			<FormControlLabel
				control={
					<Checkbox
						value="checkedB"
						color="primary"
						checked={graphs.open}
						onChange={e => {
                            setChangeMade(true);
                            toggleGraph({ visible: graphs.visible, open: !graphs.open });
                        }}
					/>
				}
				label="Panel Open"
			/>
        </>
    );
};