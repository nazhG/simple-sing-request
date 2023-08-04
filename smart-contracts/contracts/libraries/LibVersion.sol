// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

library LibVersion {
    bytes32 internal constant VERSION_STORAGE_POSITION =
        keccak256("version.diamond.storage");

    struct VersionStorage {
        string version;
    }

    function _versionStorage()
        internal
        pure
        returns (VersionStorage storage versionStorage)
    {
        bytes32 position = VERSION_STORAGE_POSITION;
        assembly {
            versionStorage.slot := position
        }
    }

    function version() internal view returns (string memory) {
        return _versionStorage().version;
    }

    function setVersion(string memory version_) internal {
        _versionStorage().version = version_;
    }
}
