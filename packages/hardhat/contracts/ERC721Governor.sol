// SPDX-License-Identifier: GPL-3.0

/// @title Governor for ERC721DAOToken.

pragma solidity ^0.8.6;

import {ERC721DAOToken} from "./ERC721DAOToken.sol";
import {GovernorVotesERC721Upgradeable} from "./GovernorVotesERC721Upgradeable.sol";
import {GovernorCountingSimpleUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorCountingSimpleUpgradeable.sol";
import {GovernorTimelockControlUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorTimelockControlUpgradeable.sol";
import {GovernorUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import {TimelockControllerUpgradeable} from "@openzeppelin/contracts-upgradeable/governance/TimelockControllerUpgradeable.sol";


contract ERC721Governor is
    GovernorVotesERC721Upgradeable,
    GovernorCountingSimpleUpgradeable,
    GovernorTimelockControlUpgradeable
{
    function initialize(
        string memory name_,
        ERC721DAOToken token_,
        TimelockControllerUpgradeable timelockAddress
    ) public initializer {
        __Governor_init(name_);
        __GovernorVotesERC721Upgradeable_init(token_);
        __GovernorTimelockControl_init(timelockAddress);
    }

    // TODO solve the following overrides

    function quorum(uint256 blockNumber) public view virtual override returns (uint256) {
        return 0;
    }

    function votingDelay() public view virtual override returns (uint256) {
        return 0;
    }

    function votingPeriod() public view virtual override returns (uint256) {
        return 0;
    }

    function state(uint256 proposalId)
        public
        view
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    )
        internal
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
    {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    )
        internal
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
