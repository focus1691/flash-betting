import React from "react";
import Draggable from "react-draggable";
import DraggableGraph from "../DraggableGraph";

export default () => {
  return (
    <div id="home-view">
      <Draggable bounds="body">
        <div
          className="box"
          style={{ position: "absolute", top: "25%", left: "50%" }}
        >
          <DraggableGraph />
        </div>
      </Draggable>
      <h1>Welcome to Trader Pro</h1>
      <hr />
    </div>
  );
};
