import React, { useState } from "react";
import Menu from "./Menu/";
import Market from "./Market/";
import Settings from "./Settings/";

const ToggleMenu = () => {
  const [openTab, setOpenTab] = useState(2);
  const [activeStyle, setActiveStyle] = useState("#389C41");

  const createToggleButton = (name, tab) => {
    return (
      <button
        className={"toggle-button"}
        style={openTab === tab ? { background: activeStyle } : {}}
        onClick={e => {
          setOpenTab(tab);
        }}
      >
        {name}
      </button>
    );
  };

  const renderActiveTab = () => {
    switch (openTab) {
      case 1: return <Menu/>;
      case 2: return <Market/>
      case 3: return <Settings/>
      default: return null;
    }
  };

  return (
      <div id="toggle-buttons">
        {createToggleButton("Menu", 1)}
        {createToggleButton("Market", 2)}
        {createToggleButton("Settings", 3)}
        {renderActiveTab()}
      </div>
  );
};

export default ToggleMenu;