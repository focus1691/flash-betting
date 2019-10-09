

const iconForEvent = sportID => {
    switch (sportID) {
        case 7:
            return window.location + "icons/horse-riding.png";
        default:
            return window.location + "/images/baseball-player.png";
    }
}

export { iconForEvent };