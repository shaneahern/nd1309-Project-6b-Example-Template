# Ethereum Dapp for Tracking Items through Supply Chain

This repository containts an Ethereum DApp that demonstrates a Supply Chain flow between a Seller and Buyer. The user story is similar to any commonly used supply chain process. A Seller can add items to the inventory system stored in the blockchain. A Buyer can purchase such items from the inventory system. Additionally a Seller can mark an item as Shipped, and similarly a Buyer can mark an item as Received.

## Libraries
- Truffle v4.1.14
- Solidity v0.4.24
- @truffle/contract v4.3.25
- web3 v0.20.6
- webpack v4.46.0
- jquery.js v1.12.4

## Tools
- ipfs v0.9.0
- Ganache v2.5.4
- Infura https://infura.io/


## IPFS
I used [IPFS](https://ipfs.io/) to host my DApp and make it pubically accessible. I created a distribution build using [Webpack](https://webpack.js.org) to bundle all JS dependencies, assets and contract ABIs into a compact set of files and published the bundle to IPFS.

My DApp is available at https://gateway.ipfs.io/ipns/k51qzi5uqu5dkzi7wg4bxvofm9fw2kf8ry06wkmwdyle5ehbq5p2luh71pqb94/

## Contract Deployment on the Rinkeby Test Network
* The contract SupplyChain.sol is deployed to the Rinkeby test network at 0x4A13Fc3541b874190087D49BC6A9Dbe6a780369C
* You can view the SupplyChain contract deployment information transaction history at https://rinkeby.etherscan.io/address/0x4A13Fc3541b874190087D49BC6A9Dbe6a780369C
* I also deployed contracts for each role used in SupplyChain.sol (FarmerRole.sol, DistributorRole.sol, RetailerRole.sol, and ConsumerRole.sol) as well as an interface contract Ownable.sol that is implemented by SupplyChain.sol to control ownership of the contract.

## UML Diagrams
Coming soon

## Testing the DApp
* The project includes unit tests written with [Mocha](https://mochajs.org/) testing framework and [Chai](https://www.chaijs.com/) for assertions in TestSupplyChain.js that can be run as ```truffle test```

## Using the DApp
* To use the DApp, you should have the [Metamask browser plugin](https://metamask.io/) connected to the Rinkeby test network and be set up with four accounts, each containing sufficient ETH for transactions. You can get free test ETH to use on the Rinekby test network at https://faucet.rinkeby.io/

* Navigate to https://gateway.ipfs.io/ipns/k51qzi5uqu5dkzi7wg4bxvofm9fw2kf8ry06wkmwdyle5ehbq5p2luh71pqb94/

The DApp User Interface when running should look like...


![image](https://user-images.githubusercontent.com/76200/127230318-1ff7dd6b-8df5-40ee-a6f9-8bfa46fadf35.png)


* The DApp has four roles required at different parts of the supply chain: 
  * Farmer - to harvest, process, pack and make products available for sale.
  * Distributor - to buy products from Farmers, and ship them to Retailers.
  * Retailer - to receive products from distributors.
  * Consumer - to purchase products from retailers.

* Products must be process in the following supply chain order:
  * Harvest (Farmer)
  * Process (Farmer)
  * Pack (Farmer)
  * For Sale (Farmer)
  * Buy (Distributor)
  * Ship (Distributor)
  * Receive (Retailer)
  * Purchase (Consuemr)
  
 * Supply chain order and roles: If you attempt to process the product in any other order, or you are not connected to the wallet account for the role that matches the step in the supply chain, the transacton will fail with an error. For example, if you attempt to Buy and product that is not currently in the "For Sale" state, or Ship a product that has already been Shipped, the transaction will fail. Or if you are connected to the wallet for the Consumer role and not the Farmer role, and attempt to Harvest a product, the transaction will fail.

* Enter a wallet address from your Metamask plugin for each of the four role in the role form and click "Register Roles". For convience, you may wish to rename each account in Metamask to the role name (Farmer, Distributor, Retailer and Consumer).

* Start by selecting the Farmer account in Metamask, scroll to the Farmer section of the page. Enter your farm details (name, info, lat/lon location) and a price for your product. Click on "Harvest". 

* When the transaction is completed, the sidebar on the right should show ```Harvested - 0x58bdt 914f22f887d065182a44d328ab8af6014b8e1e69f2cea506130bbed08ef9``. You may now click on "Process". When that tranaction completes the side bar will show ```Processed - 0xd518a13e246794440ea4b7ef52519ad57a5e14608ea0c31619530ce5632669d0```

* Continue in the supply chain order descrbed above until the product reaches the "ForSale" state. Then switch wallet account in MetaMask to the account you assocated with the Distributor role. Click "Buy" and the DApp will send a purchase transaction for 3ETH. The contract will deduct the price set by the Farmer for the product and refund the balance. So if the price was set to 1ETH, the contract will refund 2ETH back to the Distributor wallet and send 1ETH to the Farmer wallet.

* Continue this process untill you have become the Consumer and run the Purchase transaction. The Consumer wallet address should now be listed as the Owner ID for the product in the sidebar, and you should see the full transaction history for the supply chain history.

# Build Info (from orignial forked starter project code)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Please make sure you've already installed ganache-cli, Truffle and enabled MetaMask extension in your browser.

```
Give examples (to be clarified)
```

### Installing

> The starter code is written for **Solidity v0.4.24**. At the time of writing, the current Truffle v5 comes with Solidity v0.5 that requires function *mutability* and *visibility* to be specified (please refer to Solidity [documentation](https://docs.soliditylang.org/en/v0.5.0/050-breaking-changes.html) for more details). To use this starter code, please run `npm i -g truffle@4.1.14` to install Truffle v4 with Solidity v0.4.24. 

A step by step series of examples that tell you have to get a development env running

Clone this repository:

```
git clone https://github.com/udacity/nd1309/tree/master/course-5/project-6
```

Change directory to ```project-6``` folder and install all requisite npm packages (as listed in ```package.json```):

```
cd project-6
npm install
```

Launch Ganache:

```
ganache-cli -m "spirit supply whale amount human item harsh scare congress discover talent hamster"
```

Your terminal should look something like this:

![truffle test](images/ganache-cli.png)

In a separate terminal window, Compile smart contracts:

```
truffle compile
```

Your terminal should look something like this:

![truffle test](images/truffle_compile.png)

This will create the smart contract artifacts in folder ```build\contracts```.

Migrate smart contracts to the locally running blockchain, ganache-cli:

```
truffle migrate
```

Your terminal should look something like this:

![truffle test](images/truffle_migrate.png)

Test smart contracts:

```
truffle test
```

All 10 tests should pass.

![truffle test](images/truffle_test.png)

In a separate terminal window, launch the DApp:

```
npm run dev
```

## Built With

* [Ethereum](https://www.ethereum.org/) - Ethereum is a decentralized platform that runs smart contracts
* [IPFS](https://ipfs.io/) - IPFS is the Distributed Web | A peer-to-peer hypermedia protocol
to make the web faster, safer, and more open.
* [Truffle Framework](http://truffleframework.com/) - Truffle is the most popular development framework for Ethereum with a mission to make your life a whole lot easier.


## Authors

See also the list of [contributors](https://github.com/your/project/contributors.md) who participated in this project.

## Acknowledgments

* Solidity
* Ganache-cli
* Truffle
* IPFS
