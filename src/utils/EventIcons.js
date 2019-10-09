

const iconForEvent = sportID => {
    switch (sportID) {
        case 7:
            return window.location.origin + "/icons/horse-riding.png";
        default:
            return window.location.origin + "/images/baseball-player.png";
    }
}

export { iconForEvent };