import React from "react";
import { sumMatchedBets } from "../../utils/PriceCalculator";
import { formatCurrency } from "./../../utils/NumberFormat";

export default ({
  market,
  ladder,
  marketOpen,
  status,
  country,
  oneClickRef,
  oneClickOn,
  toggleOneClick
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
              ).toLocaleTimeString()} ${market.marketName}  ${
              market.event.venue
              }`
              : "No Event Selected"}
          </h1>
          {oneClickOn ? (
            <React.Fragment>
              <div id="one-click-stake">
                <button>Stake</button>
                <button>2</button>
                <button>4</button>
                <button>6</button>
                <button>8</button>
                <button>10</button>
                <button>12</button>
                <button>14</button>
              </div>
              <br />
              <div id="one-click-liability">
                <button>Liability</button>
                <button>5</button>
                <button>7.50</button>
                <button>10</button>
                <button>12.50</button>
                <button>15</button>
                <button>17.50</button>
                <button>20</button>
              </div>
            </React.Fragment>
          ) : null}
          {marketOpen && status === "OPEN" ? (
            <div className={"in-play"}>
              <span className={"in-play"}>Going in-play</span>
              <img
                src={window.location.origin + "/icons/checked.png"}
                alt={"active"}
              />
            </div>
          ) : marketOpen && status === "SUSPENDED" ? (
            <div className={"in-play"}>
              <span>In-play</span>
              <img
                src={window.location.origin + "/icons/checked.png"}
                alt={"in-play"}
              />
            </div>
          ) : (
                <div className={"in-play"}>
                  <span className={"in-play"}>Not Going in-play</span>
                  <img
                    src={window.location.origin + "/icons/error.png"}
                    alt={"Not active"}
                  />
                </div>
              )}
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
        <th colSpan="1"></th>

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
