// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./V1.sol";

/**
 * @notice A Farewell contract that returns a farewell
 */
contract V2 is V1 {
    function farewell() public pure returns (string memory) {
        return "Goodbye, World!";
    }
}
