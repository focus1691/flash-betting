
import React from "react";

const renderContent = (text, img, alt) => {
    return (
        <div className={"in-play"}>
            <span className={"in-play"}>{text}</span>
            <img src={window.location.origin + img} alt={{alt}}
            />
        </div>
    );
};

const renderRaceStatus = (marketOpen, status) => {
    if (!marketOpen) return null;

    switch (status) {
        case "OPEN":
            return renderContent("Going in-play", "/icons/inactive.png", "Active");
        case "SUSPENDED":
            return renderContent("Not Going in-play", "/icons/error.png", "Suspended");
        case "RUNNING":
            return renderContent("Going in-play", "/icons/checked.png", "Active");
        default:
            return null;
    }
};

export { renderRaceStatus };