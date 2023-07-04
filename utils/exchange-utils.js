
const axios = require('axios');
const { getDecimals } = require("./token-utils");
const { OptimalRate, SwapSide } = require("paraswap-core");
const { default: BigNumber } = require('bignumber.js');
const { log } = require('console');

const ONE_INCH_BASE_API = 'https://api.1inch.io/v5.0/1/';
const axiosInstanceFor1inch = axios.create({ baseURL: ONE_INCH_BASE_API });

// paraswap exchange
const PARA_SWAP_BASE_API = 'https://apiv5.paraswap.io/';
const axiosInstanceForPara = axios.create({ baseURL: PARA_SWAP_BASE_API });

const PARA_SWAP_PARTNER = "chucknorris";
const SLIPPAGE = 15; // 1%

const PLATFORM_ONE_INCE = 0;
const PLATFORM_PARA_SWAP = 1;

async function buildExchangeCalldata(platform, contractAddress, fromAsset, toAsset, fromAmount, slippage) {
    if (platform == PLATFORM_ONE_INCE) {
        const result = await oneInchBuildExchangeParams(contractAddress, fromAsset, toAsset, fromAmount, slippage);
        if (!Object.keys(result).includes("tx")) {
            throw new Error("1inch request exchange parameters failed");
        }
        return result.tx.data;
    } else if (platform == PLATFORM_PARA_SWAP) {
        const result = await paraswapBuildExchangeParams(contractAddress, fromAsset, toAsset, fromAmount, slippage);
        if (!Object.keys(result).includes("data")) {
            throw new Error("pawaswap request exchange parameters failed");
        }
        return result.data;
    } else {
        assert(false, "platform not found!");
    }
}


async function oneInchBuildExchangeParams(contractAddress, fromAsset, toAsset, amount, slippage) {
    try {
        //console.log("====",`swap?fromAddress=${fromAddress}&fromTokenAddress=${fromAsset}&toTokenAddress=${toAsset}&amount=${amount}&slippage=${slippage}&disableEstimate=true&allowPartialFill=true`);
        const rep = await axiosInstanceFor1inch.get(`swap?fromAddress=${contractAddress}&fromTokenAddress=${fromAsset}&toTokenAddress=${toAsset}&amount=${amount}&slippage=${slippage}&disableEstimate=true&allowPartialFill=true`);
        return rep.data;
    } catch (error) {
        console.log(error);
    }
}

async function getRateParams(
    srcAsset,
    destAsset,
    srcAmount,
    partner = PARA_SWAP_PARTNER
) {
    const srcTokenDecimals = await getDecimals(srcAsset);
    const destTokenDecimals = await getDecimals(destAsset);

    const queryParams = {
        srcToken: srcAsset,
        destToken: destAsset,
        srcDecimals: srcTokenDecimals.toString(),
        destDecimals: destTokenDecimals.toString(),
        amount: srcAmount,
        side: SwapSide.SELL,
        network: '1',
        partner
    };

    const searchString = new URLSearchParams(queryParams);

    // const pricesURL = `${baseURLParaswap}prices/?${searchString}`;
    // console.log("GET /price URL", pricesURL);

    const rep = await axiosInstanceForPara.get(`prices/?${searchString}&excludeDEXS=ParaSwapPool,ParaSwapLimitOrders`);

    // const result = await axios.get(pricesURL);
    return rep.data.priceRoute;
}

async function paraswapBuildExchangeParams(contractAddress, srcAsset, destAsset, amount, slippage) {
    const priceRoute = await getRateParams(srcAsset, destAsset, amount);
    const minAmount = new BigNumber(priceRoute.destAmount)
        .times(1 - slippage / 1000)
        .toFixed(0);

    const txConfig = {
        priceRoute,
        srcToken: srcAsset,
        srcDecimals: priceRoute.srcDecimals,
        destToken: destAsset,
        destDecimals: priceRoute.destDecimals,
        srcAmount: amount,
        destAmount: minAmount,
        userAddress: contractAddress,
        receiver: contractAddress,
        deadline: Date.now() + 1000 * 3600 * 24 * 365
    };
    // console.log('txConfig:',JSON.stringify(txConfig));
    const rep = await axiosInstanceForPara.post('transactions/1?ignoreChecks=true', txConfig);
    return rep.data;
}


module.exports = {
    buildExchangeCalldata
}



