// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;

interface IComposableStablePool {

    /**
    * @dev Returns the effective BPT supply.
     *
     * In other pools, this would be the same as `totalSupply`, but there are two key differences here:
     *  - this pool pre-mints BPT and holds it in the Vault as a token, and as such we need to subtract the Vault's
     *    balance to get the total "circulating supply". This is called the 'virtualSupply'.
     *  - the Pool owes debt to the Protocol in the form of unminted BPT, which will be minted immediately before the
     *    next join or exit. We need to take these into account since, even if they don't yet exist, they will
     *    effectively be included in any Pool operation that involves BPT.
     *
     * In the vast majority of cases, this function should be used instead of `totalSupply()`.
     *
     * **IMPORTANT NOTE**: calling this function within a Vault context (i.e. in the middle of a join or an exit) is
     * potentially unsafe, since the returned value is manipulable. It is up to the caller to ensure safety.
     *
     * This is because this function calculates the invariant, which requires the state of the pool to be in sync
     * with the state of the Vault. That condition may not be true in the middle of a join or an exit.
     *
     * To call this function safely, attempt to trigger the reentrancy guard in the Vault by calling a non-reentrant
     * function before calling `getActualSupply`. That will make the transaction revert in an unsafe context.
     * (See `whenNotInVaultContext` in `ComposableStablePoolRates`).
     *
     * See https://forum.balancer.fi/t/reentrancy-vulnerability-scope-expanded/4345 for reference.
     */
    function getActualSupply() external view returns (uint256);

}