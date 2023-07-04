// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

interface IGearBoxAirdropDistributor {

    /// @dev Returns the token distributed by this contract.
    function token() external view returns (address);

    /// @dev Returns the total amount of token claimed by the user
    function claimed(address user) external view returns (uint256);
    // Claim the given amount of the token to the given address. Reverts if the inputs are invalid.
    /// @dev Claims the given amount of the token for the account. Reverts if the inputs are not a leaf in the tree
    ///      or the total claimed amount for the account is more than the leaf amount.
    function claim(
        uint256 index,
        address account,
        uint256 totalAmount,
        bytes32[] calldata merkleProof
    ) external;
}
