// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
/**
 * @notice A Greeter contract that returns a greeting
 */

contract V1 {
    function greet() public pure returns (string memory) {
        return "Hello, World!";
    }
}
