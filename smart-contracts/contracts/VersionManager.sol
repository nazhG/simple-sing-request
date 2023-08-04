// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat-deploy/solc_0.8/diamond/UsingDiamondOwner.sol";
import "./libraries/LibVersion.sol";
/**
 * @notice This contract will be a facet of the Diamond
 *         for interact with the diamond storage
 */
contract VersionManager is UsingDiamondOwner {
    function version() external view returns (string memory) {
        return LibVersion.version();
    }

    function setVersion(string memory version_) public onlyOwner {
        LibVersion.setVersion(version_);
    }
}
