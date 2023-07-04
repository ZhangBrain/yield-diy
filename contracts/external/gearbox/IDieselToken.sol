// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

interface IDieselToken {
    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function decimals() external view returns (uint256);
}
