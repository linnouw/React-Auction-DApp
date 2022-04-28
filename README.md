Frontend UI for Generic trading platform by Akka. Every user can create an auction or bid on an existing auction. At the end of the bidding process, winner will get his money from highestBidder and other bidders are refunded.

##Requirements

* node v16.14.0
* npm v6.14.0
* truffle v5.4.32
* ganache-cli
* Solidity v0.5.16
* Web3.js v1.5.3

##To get started
Before starting this project, clone Ethereum-auction-app on your local machine and follow its steps to start ganache network.

Once you deployed Ethereum-auction-app on Ganache:
1. Create a folder ./src/abi
2. Copy paste "Auction.json", "AuctionList.json" & "MyAuction.json" (under ./built/contracts in Ethereum-auction-app ) under ./src/abi.

To install dependencies
`npm install`

To start the project
`npm start`

