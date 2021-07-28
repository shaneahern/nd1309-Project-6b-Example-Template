// To deploy to rinkeby test network, uncomment lines below
// - add your infura key
// - create a local file named .secret with the mnemonic for 
// your infura project

// const HDWalletProvider = require('truffle-hdwallet-provider');
// const infuraKey = "<your infura key";

// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },

    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4,       // Rinkeby's id
      gaslimit: 168000,
      gasPrice: 1000000000,
    },
  },
  compilers: {
    solc: {
      version: " >=0.4.24", // A version or constraint - Ex. "^0.5.0"
                         // Can also be set to "native" to use a native solc\
      parser: "solcjs",  // Leverages solc-js purely for speedy parsing
      settings: {
        optimizer: {
          enabled: true,
        },
      },
    }
  }
};