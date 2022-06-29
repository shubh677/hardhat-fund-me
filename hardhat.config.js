require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy")
require("dotenv").config()

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig


 */

const RINKEBY_RPC_URL=process.env.RINKEBY_RPC_URL || "https://rinkeby"
const PRIVATE_KEY=process.env.PRIVATE_KEY || "0xkey"
const ETHERSCAN_API_KEY=process.env.ETHERSCAN_API_KEY || "key"


module.exports = {
  solidity: {
    compilers: [
      {version: "0.8.8"},
      {version: "0.6.6"}
    ]
  },
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
      blockConfirmations: 6

    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer:{
      default: 0
    }
}
};
