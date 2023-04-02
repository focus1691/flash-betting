<p align="center">
  <a href="#">
    <img src="public/images/logo.png" title="flash-betting">
  </a>
</p>

# Flash Betting

Flash Betting is a mostly Front End app used to trade and interact with the BetFair API. The goal is to make a free version that can compete with the likes of GeeksToy, Bet Trader, and others.

The app runs both the Front End / Back End locally and concurrently.

## Features:
1) Grid View :heavy_check_mark:
2) Hedging :heavy_check_mark:
3) One Click Mode in Grid :heavy_check_mark:
4) Back / Lay tools :heavy_check_mark:
5) Stop Loss :heavy_check_mark:
6) Tick Offset :heavy_check_mark:
7) Charting your recent trade history :heavy_check_mark:
8) Ladder View (currently still in progress) :hourglass_flowing_sand:

## Technologies used in this project include:
<table>
  <tr>
    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="48" height="48" /> Node.js</td>
    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="48" height="48" /> React.js</td>
    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" width="48" height="48" /> Redux</td>
    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" width="48" height="48" /> Material UI</td>
    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" width="48" height="48" /> SQLite</td>
    <td><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg" width="48" height="48" /> Electron</td>
  </tr>
</table>

# setup

In order to connect to the Betfair API you will need an App Key, and a BetFair username/password.

### App Key
Follow <a href="https://docs.developer.betfair.com/display/1smk3cen4v3lu3yomq5qye0ni/Application+Keys" target="_blank">these</a> instructions to get your app key, you can either use a delayed or live key.
The Live Application Key costs a one time fee of £299 payable to BetFair.

# Installation (Web)

```bash
$ npm install // Install the dependencies
$ npm run browser // Run the Front End and Local Back End concurrently
```

# Installation (Desktop App)

```bash
$ npm install // Install the dependencies
$ npm run electron-build // Build the .dmg or .exe with Electron Builder
```
