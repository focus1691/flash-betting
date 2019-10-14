import React from "react";
import { renderRaceStatus } from "./RaceStatus";
import { sumMatchedBets } from "../../utils/PriceCalculator";
import { formatCurrency } from "./../../utils/NumberFormat";
import { getOrderBtnBG } from "../../utils/ColorManipulator";
import getQueryVariable from "../../utils/GetQueryVariable";
import { getMarketCashout } from "../../utils/Bets/GetMarketCashout";

export default ({
  market,
  ladder,
  marketOpen,
  inPlay,
  status,
  country,
  oneClickRef,
  oneClickOn,
  toggleOneClick,
  stake,
  setStake,
  stakeBtns,
  layBtns,
  bets
}) => (
    <React.Fragment>
      <tr id="grid-header">
        <th colSpan="11">
          <button
            id="one-click-btn"
            ref={oneClickRef}
            onClick={e => {
              toggleOneClick();
            }}
          >
            {`Turn One click ${oneClickOn ? "off" : "on"}`}
          </button>
          <span className={"grid-video"}>
            {" "}
            <img
              src={window.location.origin + "/icons/youtube.png"}
              alt={"Video"}
              onClick={e => {
                window.open(
                  `https://videoplayer.betfair.com/GetPlayer.do?tr=1&mID=${market.event.marketId}&allowPopup=false`,
                  market.event.name,
                  "width=500,height=500"
                );
              }}
            />
          </span>
          <h1>
            {marketOpen
              ? `${new Date(
                market.marketStartTime
              ).toLocaleTimeString()} ${market.marketName} ${
              market.event.venue || ""
              }`
              : "No Event Selected"}
          </h1>
          {oneClickOn ? (
            <React.Fragment>
              <div id="one-click-stake">
                <button>Stake</button>
                {stakeBtns.map(price => (
                  <button
                    style={{background: getOrderBtnBG("STAKE", price, stake, -70)}}
                    onClick={e => setStake(price)}>
                    {price}
                  </button>
                ))}
              </div>
              <br />
              <div id="one-click-liability">
                <button>Liability</button>
                {layBtns.map(price => (
                  <button
                  style={{background: getOrderBtnBG("LAY", price, stake, -70)}}
                  onClick={e => setStake(price)}>
                  {price}
                </button>
                ))}
              </div>
            </React.Fragment>
          ) : null}
          {renderRaceStatus(marketOpen, status, inPlay)}
          <span id="matched-bets">
            {marketOpen
              ? `Matched: ${formatCurrency(
                country.localeCode,
                country.currencyCode,
                sumMatchedBets(ladder)
              )}`
              : null}
          </span>
        </th>
      </tr>
      <tr id="grid-subheader">
        <th>
          <span>Market Cashout</span>
        </th>
        {/* The Cash out figure simply adds all current profit and losses together
            If you click it, then it should place N bets (or how ever many you need)
            to close those positions/
        */}
        <th id="market-cashout" colSpan="1" onClick={() => {

        }}>
          <span>{getMarketCashout(getQueryVariable("marketId"), bets)}</span>
        </th>

        <th colSpan="1"></th>
        <th></th>
        <th></th>
        <th>
          <span>Back</span>
        </th>
        <th>
          <span>Lay</span>
        </th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
    </React.Fragment>
  );
