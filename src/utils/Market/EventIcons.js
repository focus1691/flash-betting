const iconForEvent = sportID => {
    switch (parseInt(sportID)) {
        case 1:
            return window.location.origin + "/icons/football.png";
        case 2:
            return window.location.origin + "/icons/tennis-ball.png";
        case 3:
            return window.location.origin + "/icons/golf.png";
        case 4:
            return window.location.origin + "/icons/cricket.png";
        case 5:
            return window.location.origin + "/icons/rugby-ball.png";
        case 1477:
            return window.location.origin + "/icons/rugby-ball.png";
        case 6:
            return window.location.origin + "/icons/boxing.png";
        case 7:
            return window.location.origin + "/icons/horse-riding.png";
        case 8:
            return window.location.origin + "/icons/racing-flag.png";
        case 4339:
            return window.location.origin + "/icons/greyhound.png";
        case 6422:
            return window.location.origin + "/icons/billiard.png";
        case 7511:
            return window.location.origin + "/icons/baseball.png";
        case 7522:
            return window.location.origin + "/icons/basketball.png";
        case 27454571:
            return window.location.origin + "/icons/trophy.png";
        case 26420387:
            return window.location.origin + "/icons/martial-arts-couple-fight.png";

        default:
            return window.location.origin + "/images/baseball-player.png";
    }
}

export { iconForEvent };