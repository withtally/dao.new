// SPDX-License-Identifier: GPL-3.0

/// @title Minter for ERC721DAOToken.

pragma solidity ^0.8.6;

import { ERC721DAOToken } from "./ERC721DAOToken.sol";
import { PaymentSplitterUpgradeable } from "@openzeppelin/contracts-upgradeable/finance/PaymentSplitterUpgradeable.sol";
import { AccessControlEnumerableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import { PausableUpgradeable } from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

abstract contract IERC721Minter is PaymentSplitterUpgradeable, AccessControlEnumerableUpgradeable, PausableUpgradeable {
    bytes32 public constant CREATOR_ROLE = keccak256("CREATOR_ROLE");

    ERC721DAOToken public token;
    uint256 public maxMintsPerTx;
    uint256 public startingBlock;

    modifier afterStartingBlock() {
        require(block.number >= startingBlock, "IERC721Minter: Sale hasn't started yet!");
        _;
    }

    function initialize(
        address creator_,
        ERC721DAOToken token_,
        uint256 startingBlock_,
        address[] memory payees_,
        uint256[] memory shares_
    ) public virtual initializer {
        _setRoleAdmin(CREATOR_ROLE, CREATOR_ROLE);
        _setupRole(CREATOR_ROLE, creator_);

        // TODO do we keep the Deployer as admin?
        _setupRole(CREATOR_ROLE, _msgSender());

        __PaymentSplitter_init(payees_, shares_);

        token = token_;
        startingBlock = startingBlock_;
        _pause();
    }

    function pause() public onlyRole(CREATOR_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(CREATOR_ROLE) {
        _unpause();
    }

    function setStartingBlock(uint256 startingBlock_) external onlyRole(CREATOR_ROLE) {
        startingBlock = startingBlock_;
    }
}
