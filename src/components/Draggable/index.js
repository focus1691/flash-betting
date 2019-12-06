import React from "react";
import Draggable from "react-draggable";
import DraggableGraph from "./Graph";
import DraggableLiveStream from "./LiveStream";

export default (() => {
    return (
        <React.Fragment>
            <Draggable bounds="body">
                <div
                    className="box"
                    style={{ position: "absolute", top: "25%", left: "50%", zIndex: 9999 }}
                >
                    <DraggableGraph />
                </div>
            </Draggable>
            <Draggable bounds="body">
                <div
                    className="box"
                    style={{ position: "absolute", top: "25%", left: "50%", zIndex: 9999 }}
                >
                    <DraggableLiveStream />
                </div>
            </Draggable>
        </React.Fragment>
    );
});