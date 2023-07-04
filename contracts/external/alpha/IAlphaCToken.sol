// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IAlphaCToken {

    /**
     * @notice Calculates the exchange rate from the underlying to the CToken
     * @dev This function does not accrue interest before calculating the exchange rate
     * @return Calculated exchange rate scaled by 1e18
     */
    function exchangeRateStored() external view returns (uint256);

    /**
     * @notice Accrue interest then return the up-to-date exchange rate
     * @return Calculated exchange rate scaled by 1e18
     */
    function exchangeRateCurrent() external returns (uint256);

    function underlying() external returns (address);

    function balanceOf(address) external view returns (uint256);

    function totalSupply() external view returns (uint256);

}