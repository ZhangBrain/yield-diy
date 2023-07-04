// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// NOTE: This file generated from frxETHMinter contract at https://etherscan.io/address/0xbAFA44EFE7901E04E39Dad13167D089C559c1138#code
interface IFrxETHMinter {
    /// @notice Mint frxETH and deposit it to receive sfrxETH in one transaction
    /** @dev Could try using EIP-712 / EIP-2612 here in the future if you replace this contract,
        but you might run into msg.sender vs tx.origin issues with the ERC4626 */
    function submitAndDeposit(address recipient) external payable returns (uint256 shares);

    /// @notice Mint frxETH to the sender depending on the ETH value sent
    function submit() external payable;

    /// @notice Mint frxETH to the recipient using sender's funds
    function submitAndGive(address recipient) external payable;
}