import { HardhatUserConfig } from 'hardhat/types';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

import 'hardhat-deal';
import '@nomicfoundation/hardhat-foundry';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-truffle5';
import 'hardhat-gas-reporter';
import 'hardhat-contract-sizer';
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-log-remover';
import * as dotenv from 'dotenv';
dotenv.config();

const {
    removeConsoleLog
} = require('hardhat-preprocessor');

let keys = {
    alchemyKey: {
        dev: process.env.CHAIN_KEY
    }
}

try {
    keys = require('./dev-keys.json');
} catch (error) {
}

process.env.FORCE_COLOR = '3';
process.env.TS_NODE_TRANSPILE_ONLY = 'true';
const ETHERSCAN_API = process.env.ETHERSCAN_API;

const DEFAULT_BLOCK_GAS_LIMIT = 30000000;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async () => {
    const accounts = await ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config = {
    defaultNetwork: 'hardhat',
    networks: {
        hardhat: {
            chains: {
                1: {
                    hardforkHistory: {
                        berlin: 10000000,
                        london: 20000000,
                    }
                }
            },
            forking: {
                url: 'https://eth-mainnet.alchemyapi.io/v2/' + keys.alchemyKey.dev,
                blockNumber: 17143500, // <-- edit here
            },
            blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
            // timeout: 1800000,
            allowUnlimitedContractSize: true,
        },
        localhost: {
            url: 'http://127.0.0.1:8545',
            allowUnlimitedContractSize: true,
            // GasPrice used when performing blocking, in wei
            // gasPrice: 100 * 10 ** 9,
            timeout: 1800000,
            tags: ['usd_modules'],
            saveDeployments: true,
            /*
              notice no mnemonic here? it will just use account 0 of the hardhat node to deploy
              (you can put in a mnemonic here to set the deployer locally)
            */
        },
        mainnet: {
            url: `https://eth-mainnet.g.alchemy.com/v2/ZYgaLj6aguvs_FkgM-2dKhBR9ZXEGC9X`,
            accounts: process.env.ACCOUNT_PRIVATE_KEY ? [`${process.env.ACCOUNT_PRIVATE_KEY}`] : undefined,
            // The gasPrice used when performing the blocking, in wei, for the release, 80Gwei is used
            gasPrice: 15 * 10 ** 9,
            timeout: 2000000000,
            deploy: ['deploy/'],
            saveDeployments: true,
            // timeoutBlocks: 10000
        },
        testmachine: {
            url: 'http://127.0.0.1:8545',
        },
        goerli: {
            allowUnlimitedContractSize: true,
            url: `https://eth-goerli.g.alchemy.com/v2/_-ndBmlqrt9sGNYEkaBMZssNSiXaxB0m`,
            accounts: process.env.ACCOUNT_PRIVATE_KEY ? [`${process.env.ACCOUNT_PRIVATE_KEY}`] : undefined,
        },
        kovan: {
            url: `https://kovan.infura.io/v3/8476fc1501574602923b36e84b1943bb`,
            accounts: process.env.ACCOUNT_PRIVATE_KEY ? [`${process.env.ACCOUNT_PRIVATE_KEY}`] : undefined,
        },
        rinkeby: {
            url: 'https://arb-mainnet.g.alchemy.com/v2/QyRoYoT8DwdeaCQC9PYwPtPKbworxRyf',
            // accounts : accounts(), //must mnemonic
            // Looking at the source code, here we enter the HardhatNetworkHDAccountsUserConfig object, which is to find the wallet address through the mnemonic.
            accounts: {
                mnemonic: 'XXXXX',
            },
        },
    },
    etherscan: {
        // The api of etherscan is wrapped in the hardhat plugin for open source use
        apiKey: ETHERSCAN_API,
    },
    solidity: {
        compilers: [
        {
            version: '0.8.17',
            settings: {
                optimizer: {
                    details: {
                        yul: true,
                    },
                    enabled: true,
                    runs: 200
                },
            },
        },
        ],
    },
    paths: {
        sources: './contracts',
        tests: './test',
        cache: './cache_hardhat',
        artifacts: './artifacts',
    },
    mocha: {
        timeout: 2000000,
    },
    preprocess: {
        eachLine: removeConsoleLog(bre => bre.network.name !== 'hardhat' && bre.network.name !== 'localhost'),
    },
    gasReporter: {
        enabled: true,
        currency: 'ETH',
    },
    contractSizer: {
        alphaSort: true,
        runOnCompile: true,
        disambiguatePaths: false,
    },
    namedAccounts: {
        deployer: {
            default: 31337,
            1: "0x4fd4c98baBEe5E22219C573713308329da40649D",
            5: "0x4fd4c98baBEe5E22219C573713308329da40649D",
            31337: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
        },
        governanor: {
            default: 31337,
            1: "0x4fd4c98baBEe5E22219C573713308329da40649D",
            5: "0x4fd4c98baBEe5E22219C573713308329da40649D",
            31337: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
        },
        delegator: {
            default: 31337,
            1: "0x4A22Dccb55723506b795A29E6861288D4147654a",
            5: "0x4A22Dccb55723506b795A29E6861288D4147654a",
            31337: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E"
        },
        vaultManager: {
            default: 31337,
            1: "0xD112AB2dFf1A7314F575967F092e6Be3EAD1D53E",
            5: "0xD112AB2dFf1A7314F575967F092e6Be3EAD1D53E",
            31337: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0"
        },
        keeper: {
            default: 31337,
            1: "0x28C8824ACDbb5dE5e83822D3Aa1b5816152dBbe4",
            5: "0x28C8824ACDbb5dE5e83822D3Aa1b5816152dBbe4",
            31337: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
        },
        user: {
            default: 31337,
            1: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
            31337: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"
        },
        friend: {
            default: 31337,
            1: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
            31337: "0x976EA74026E726554dB657fA54763abd0C3a0aa9"
        }
    },
    dealSlots: {
        "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0": 2, // LUSD
    },
};

// const forkLatest = process.env.FORK_LATEST;
// if (forkLatest) {
//     delete config.networks.hardhat.forking.blockNumber;
// }

module.exports = config;
