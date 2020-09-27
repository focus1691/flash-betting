import React, { useState } from "react";
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

export default ({ layBtns, updateLayBtn, saveSetting, classes }) => {

    const [changeMade, setChangeMade] = useState(false);

    const renderSaveBtn = () => {
        if (!changeMade) return null;

        return (
            <button
                className={"save-btn"}
                onClick={e => {
                    saveSetting({ "settings.layBtns": layBtns });
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
					Liability Button
				</Typography>
			</AppBar>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="One"
				value={`${layBtns[0]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
                    setChangeMade(true);
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						updateLayBtn({ id: 0, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Two"
				value={`${layBtns[1]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
                    setChangeMade(true);
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						updateLayBtn({ id: 1, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Three"
				value={`${layBtns[2]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
                    setChangeMade(true);
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						updateLayBtn({ id: 2, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Four"
				value={`${layBtns[3]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
                    setChangeMade(true);
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						updateLayBtn({ id: 3, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Five"
				value={`${layBtns[4]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
                    setChangeMade(true);
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						updateLayBtn({ id: 4, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Six"
				value={`${layBtns[5]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
                    setChangeMade(true);
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						updateLayBtn({ id: 5, value: e.target.value })
					}
				}}
				margin="normal"
			/>
			<TextField
				id="standard-number"
				className={classes.textField}
				type="number"
				label="Seven"
				value={`${layBtns[6]}`}
				inputProps={{ min: "1" }}
				onChange={e => {
                    setChangeMade(true);
					let val = parseInt(e.target.value);
					if (val && typeof val === 'number') {
						updateLayBtn({ id: 6, value: e.target.value })
					}
				}}
				margin="normal"
			/>
            {renderSaveBtn()}
        </>
    );
};