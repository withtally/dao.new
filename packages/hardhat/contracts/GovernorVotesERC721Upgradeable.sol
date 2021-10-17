// SPDX-License-Identifier: GPL-3.0

/// @title Governor extension that supports ERC721DAOToken votes.

pragma solidity ^0.8.6;

import {GovernorUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ERC721DAOToken} from "./ERC721DAOToken.sol";

abstract contract GovernorVotesERC721Upgradeable is Initializable, GovernorUpgradeable {
    ERC721DAOToken public token;

    function __GovernorVotesERC721Upgradeable_init(ERC721DAOToken token_) internal initializer {
        __Context_init_unchained();
        __ERC165_init_unchained();
        __IGovernor_init_unchained();
        __GovernorVotesERC721Upgradeable_init_unchained(token_);
    }

    function __GovernorVotesERC721Upgradeable_init_unchained(ERC721DAOToken token_) internal initializer {
        token = token_;
    }

    /**
     * Read the voting weight from the token's built in snapshot mechanism (see {IGovernor-getVotes}).
     */
    function getVotes(address account, uint256 blockNumber) public view virtual override returns (uint256) {
        return token.getPriorVotes(account, blockNumber);
    }
}