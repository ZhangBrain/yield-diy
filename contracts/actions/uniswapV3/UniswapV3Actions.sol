// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

contract UniswapV3Actions {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    // It should be noted that for the sake of these examples, we purposefully pass in the swap router instead of inherit the swap router for simplicity.
    // More advanced example contracts will detail how to inherit the swap router safely.
    ISwapRouter internal constant swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    /// @param _tokenIn _tokenIn.
    /// @param _tokenOut _tokenOut.
    /// @param _poolFee _poolFee.
    /// @param _amountIn The exact amount of _tokenIn that will be swapped for _tokenOut.
    /// @param _onBehalf _onBehalf.
    /// @return _amountOut The amount of _tokenOut received.
    struct SwapParams {
        address _tokenIn;
        address _tokenOut;
        uint24 _poolFee;
        uint256 _amountIn;
        address _onBehalf;
    }

    /// @notice swapExactInputSingle swaps a fixed amount of _tokenIn for a maximum possible amount of _tokenOut
    /// using the _tokenIn/_tokenOut _poolFee pool by calling `exactInputSingle` in the swap router.
    /// @dev The calling address must approve this contract to spend at least `amountIn` worth of its _tokenIn for this function to succeed.
    function swapExactInputSingle(bytes memory _staticParameters, bytes memory _dynamicParameters) external returns (uint256 _amountOut) {
        SwapParams memory params = parseInputs(_staticParameters);

        uint256 tokenInBalance = IERC20Upgradeable(params._tokenIn).balanceOf(address(this));
        if (params._amountIn > tokenInBalance) {
            revert("AmountInError");
        }

        // Approve the router to spend _tokenIn.
        TransferHelper.safeApprove(params._tokenIn, address(swapRouter), params._amountIn);

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // Set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory swapParamsParams = ISwapRouter.ExactInputSingleParams({
            tokenIn : params._tokenIn,
            tokenOut : params._tokenOut,
            fee : params._poolFee,
            recipient : params._onBehalf,
            deadline : block.timestamp,
            amountIn : params._amountIn,
            amountOutMinimum : 0,
            sqrtPriceLimitX96 : 0
        });

        // The call to `exactInputSingle` executes the swap.
        _amountOut = swapRouter.exactInputSingle(swapParamsParams);
    }

    function parseInputs(bytes memory _callData) public pure returns (SwapParams memory params) {
        params = abi.decode(_callData, (SwapParams));
    }
}
