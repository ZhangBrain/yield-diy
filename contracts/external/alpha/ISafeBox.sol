// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ISafeBox {

    function cToken() external returns (address);

    function deposit(uint amount) external;

    function deposit() external payable;

    function withdraw(uint amount) external;

    function claim(uint totalReward, bytes32[] memory proof) external;

    function totalSupply() external view returns (uint256);
}