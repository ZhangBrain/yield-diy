// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "forge-std/Test.sol";
import "../../../actions/uniswapV3/UniswapV3Actions.sol";

contract UniswapV3ActionsTest is Test {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    address constant FRIEND = 0x90F79bf6EB2c4f870365E785982E1f101E93b906;
    address constant FRIEND2 = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65;

    address internal constant NATIVE_TOKEN = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address internal constant USDT = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
    address internal constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    function test_001_swap() public {
        UniswapV3Actions uniswapV3Actions = new UniswapV3Actions();
        uint256 amountIn = 1000 * _getTokenDecimalsUnit(USDT);
        console2.log("amountIn=", amountIn);
        deal(USDT, FRIEND, amountIn);
        console2.log("after deal FRIEND USDT amount=", balanceOfToken(USDT, FRIEND));

        vm.prank(FRIEND);
        IERC20Upgradeable(USDT).safeTransfer(address(uniswapV3Actions), amountIn);
        console2.log("after safeTransfer FRIEND USDT amount=", balanceOfToken(USDT, FRIEND));
        console2.log("after safeTransfer uniswapV3Actions USDT amount=", balanceOfToken(USDT, address(uniswapV3Actions)));

        console2.log("before swap FRIEND2 USDT amount=", balanceOfToken(USDT, FRIEND2));
        console2.log("before swap FRIEND2 USDC amount=", balanceOfToken(USDC, FRIEND2));
        UniswapV3Actions.SwapParams memory params = UniswapV3Actions.SwapParams({
            _tokenIn: USDT,
            _tokenOut: USDC,
            _poolFee: 500,
            _amountIn: amountIn,
            _onBehalf: FRIEND2
        });

        uint256 amountOut = uniswapV3Actions.swapExactInputSingle(abi.encode(params), abi.encode(params));
        console2.log("after swap amountOut=", amountOut);
        console2.log("after swap FRIEND2 USDT amount=", balanceOfToken(USDT, FRIEND2));
        console2.log("after swap FRIEND2 USDC amount=", balanceOfToken(USDC, FRIEND2));
    }

    function _getTokenDecimalsUnit(address _tokenAddress) internal view returns (uint256) {
        if (_tokenAddress == NATIVE_TOKEN) {
            return 10 ** 18;
        } else {
            return 10 ** IERC20Metadata(_tokenAddress).decimals();
        }
    }

    function balanceOfToken(
        address _trackedAsset,
        address _owner
    ) internal view returns (uint256) {
        uint256 _balance;
        if (_trackedAsset == NATIVE_TOKEN) {
            _balance = _owner.balance;
        } else {
            _balance = IERC20(_trackedAsset).balanceOf(_owner);
        }
        return _balance;
    }
}
