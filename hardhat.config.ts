import "dotenv/config"
import { HardhatUserConfig } from "hardhat/config"
import "@typechain/hardhat"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers"
// import "hardhat-etherscan-abi"

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const BLOCK_NUMBER = process.env.BLOCK_NUMBER
const MNEMONIC = process.env.MNEMONIC
const ENABLE_MAINNET_FORKING = process.env.ENABLE_MAINNET_FORKING

if (ENABLE_MAINNET_FORKING && !ALCHEMY_API_KEY) throw new Error("ALCHEMY_API_KEY_NOT_FOUND")

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545",
        },
        hardhat: {
            chainId: 1,
            forking: ENABLE_MAINNET_FORKING
                ? {
                    url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
                    //blockNumber: <set>
                }
                : undefined,
        },
        polygon: {
            url: "https://eth-rinkeby.alchemyapi.io/v2/123abc123abc123abc123abc123abcde",
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.7.6",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: "0.8.4",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },
}

export default config
