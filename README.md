<p align="center">
  <a href="#">
    <img src="public/images/logo.png" alt="Flash Betting" width="500">
  </a>
</p>
<h1 align="center">Flash Betting</h1>
<p align="center">Flash Betting is a mostly Front End app used to trade and interact with the BetFair API. The goal is to make a free version that can compete with the likes of GeeksToy, Bet Trader, and others. The app runs both the Front End / Back End locally and concurrently.</p>
<h2 align="center">Features</h2>
<p align="center">
  <img src="https://img.shields.io/badge/Grid%20View-&#x2714;-brightgreen" alt="Grid View">
  <img src="https://img.shields.io/badge/Hedging-&#x2714;-brightgreen" alt="Hedging">
  <img src="https://img.shields.io/badge/One%20Click%20Mode%20in%20Grid-&#x2714;-brightgreen" alt="One Click Mode">
  <img src="https://img.shields.io/badge/Back%20/%20Lay%20tools-&#x2714;-brightgreen" alt="Back / Lay tools">
  <img src="https://img.shields.io/badge/Stop%20Loss-&#x2714;-brightgreen" alt="Stop Loss">
  <img src="https://img.shields.io/badge/Tick%20Offset-&#x2714;-brightgreen" alt="Tick Offset">
  <img src="https://img.shields.io/badge/Charting%20your%20recent%20trade%20history-&#x2714;-brightgreen" alt="Trade Charting">
  <img src="https://img.shields.io/badge/Ladder%20View-&#x231B;-yellow" alt="Ladder View (in progress)">
</p>
<h2 align="center">Technologies used in this project</h2>
<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="64" height="64">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React.js" width="64" height="64">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" alt="Redux" width="64" height="64">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" alt="Material UI" width="64" height="64">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" alt="SQLite" width="64" height="64">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg" alt="Electron" width="64" height="64">
</p>

# Setup

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
