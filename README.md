<p align="center">
  <a href="#">
    <img src="public/images/logo.png" alt="Flash Betting" width="500">
  </a>
</p>
<h1 align="center">Flash Betting</h1>
<p align="center">Flash Betting is a web application to trade using the BetFair API. It uses the Streaming API to get live price updates.</p>
<p align="center">Written in pure JS, the Front End is built in React and the backend in Node.js. It is integrated with Electron to run as a desktop application.</p>
<p align="center">Most functionality is implemented, but the app is still in an unfinished state.</p>
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
Follow <a href="https://betfair-developer-docs.atlassian.net/wiki/spaces/1smk3cen4v3lu3yomq5qye0ni/pages/2687105/Application+Keys" target="_blank">these</a> instructions to get your app key, you can either use a delayed or live key.
The Live Application Key costs a one time fee of £299 payable to BetFair.

For testing, you can request a delayed key from the BetFair Development team. With a delayed key, market updates are received approximately once per minute.

### Environmental Variables
To configure the environment variables, create a ```.env``` file in the root directory of the project. Use the provided ```example.env``` file as a template to set up your own ```.env``` file. The ```APP_KEY``` variable should be set to your purchased app key from Betfair.

Example:
```bash
APP_KEY=your_app_key_here
```

### Node.js Requirements

Flash Betting requires Node.js version 14.x to 16.x. Ensure that your environment is using one of these supported versions before proceeding with installation.

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

# Screenshots

![Login](https://github.com/focus1691/flash-betting/blob/master/screenshots/login_page.png)
![View 1](https://github.com/focus1691/flash-betting/blob/master/screenshots/chart.png)
![Chart](https://github.com/focus1691/flash-betting/blob/master/screenshots/collapsed_view.png)
![Grid](https://github.com/focus1691/flash-betting/blob/master/screenshots/grid_view.png)
![Ladder](https://github.com/focus1691/flash-betting/blob/master/screenshots/ladder_view.png)
![Market](https://github.com/focus1691/flash-betting/blob/master/screenshots/market_list.png)
