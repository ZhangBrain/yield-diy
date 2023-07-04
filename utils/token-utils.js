const ERC20 = hre.artifacts.require('@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20');

const ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const tokenMaps = {};
const tokenSymbolMaps = {};
const tokenDecimalsMaps = {};

async function getToken(assetAddr) {

    if (tokenMaps[assetAddr] !== undefined) {
        return tokenMaps[assetAddr];
    }
    const assetToken = await ERC20.at(assetAddr);
    tokenMaps[assetAddr] = assetToken;

    return assetToken;
}

async function getSymbol(_asset) {
    if (tokenSymbolMaps[_asset] !== undefined) {
        return tokenSymbolMaps[_asset];
    }
    let symbol;
    if (_asset.toLowerCase() == ETH.toLowerCase()) {
        symbol = 'ETH';
    } else {
        const erc20Token = await getToken(_asset);
        symbol = erc20Token.symbol();
    }
    tokenSymbolMaps[_asset] = symbol;
    return symbol;
}

async function getDecimals(_asset) {
    if (tokenDecimalsMaps[_asset] !== undefined) {
        return tokenDecimalsMaps[_asset];
    }

    let decimals;
    if (_asset == ETH) {
        decimals = 18;
    } else {
        const erc20Token = await getToken(_asset);
        decimals = await erc20Token.decimals();
    }
    tokenDecimalsMaps[_asset] = decimals;
    return decimals;
}

async function balanceOf(_asset, _account) {
    if (_asset == ETH) {
        const provider = ethers.provider;
        return await provider.getBalance(_account);
    } else {
        const erc20Token = await getToken(_asset);
        return erc20Token.balanceOf(_account);
    }
}

module.exports = {
    getToken,
    getSymbol,
    getDecimals,
    balanceOf
}