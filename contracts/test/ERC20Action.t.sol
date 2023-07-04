// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Constants.sol";

contract ERC20Action is Test {
    IERC20 usdc = IERC20(0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48);
    uint256 userBalance = 2000 * 1e6;
    uint256 transferAmount = 1000 * 1e6;

    function setUp() public {
        deal(address(usdc), USER, userBalance);
    }

    function testUserTransferToFriend() public {
        vm.prank(USER);
        usdc.transfer(FRIEND, transferAmount);

        assertEq(usdc.balanceOf(USER), userBalance - transferAmount);
        assertEq(usdc.balanceOf(FRIEND), transferAmount);
    }

    function testUserTransferToFriendUseRawCall() public {
        bytes4 selector = bytes4(keccak256(bytes("transfer(address,uint256)")));
        bytes memory callData = abi.encodeWithSelector(selector, FRIEND,transferAmount);

        vm.prank(USER);
        (bool success, bytes memory result) = address(usdc).call(callData);
        assert(success);

        assertEq(usdc.balanceOf(USER), userBalance - transferAmount);
        assertEq(usdc.balanceOf(FRIEND), transferAmount);

    }


    
}
