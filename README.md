<p align="center">
  <a href="https://github.com/betcode-org">
    <img src="public/images/logo.png" title="betcode-org">
  </a>
</p>

# Flash Betting

Flash Betting is a mostly Front End app used to make trade and interact with the BetFair API.

Features:
1) Grid View.
2) Hedging.
3) One Click Mode in Grid.
4) Back / Lay tools.
5) Stop Loss.
6) Tick Offset.
7) Charting your recent trade history.
8) Ladder View (currently still in progress).

# setup

In order to connect to the Betfair API you will need an App Key, and a BetFair username/password.

### App Key
Follow [these](https://docs.developer.betfair.com/display/1smk3cen4v3lu3yomq5qye0ni/Application+Keys) instructions to get your app key, you can either use a delayed or live key.
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
