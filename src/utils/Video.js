const openLiveStream = market => e => {
    if (market.event) {
        window.open(
            `https://videoplayer.betfair.com/GetPlayer.do?tr=1&mID=${market.event.marketId}&allowPopup=false`,
            market.event.name,
            "width=500,height=500"
        );
    }
}

export { openLiveStream };