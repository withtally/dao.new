// SPDX-License-Identifier: GPL-3.0

/// @title ERC-721 token for DAOs.

pragma solidity ^0.8.6;

import "./ERC721CheckpointableUpgradable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

contract ERC721DAOToken is
    ERC721CheckpointableUpgradable,
    AccessControlEnumerableUpgradeable
{
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(
            ERC721EnumerableUpgradeable,
            AccessControlEnumerableUpgradeable
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}
