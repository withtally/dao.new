// SPDX-License-Identifier: GPL-3.0

/// @title Governor for ERC721DAOToken.

pragma solidity ^0.8.6;

import { ERC721DAOToken } from "./ERC721DAOToken.sol";
import { GovernorVotesERC721QuorumFractionUpgradeable } from "./GovernorVotesERC721QuorumFractionUpgradeable.sol";
import { GovernorCountingSimpleUpgradeable } from "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorCountingSimpleUpgradeable.sol";
import { GovernorTimelockControlUpgradeable } from "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorTimelockControlUpgradeable.sol";
import { GovernorUpgradeable } from "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import { TimelockControllerUpgradeable } from "@openzeppelin/contracts-upgradeable/governance/TimelockControllerUpgradeable.sol";

contract ERC721Governor is
    GovernorVotesERC721QuorumFractionUpgradeable,
    GovernorCountingSimpleUpgradeable,
    GovernorTimelockControlUpgradeable
{
    uint256 private _votingDelay;
    uint256 private _votingPeriod;

    function initialize(
        string memory name_,
        ERC721DAOToken token_,
        TimelockControllerUpgradeable timelock_,
        uint256 votingDelay_,
        uint256 votingPeriod_,
        uint256 quorumNumerator_
    ) public initializer {
        __Governor_init(name_);
        __GovernorVotesERC721Upgradeable_init(token_);
        __GovernorTimelockControl_init(timelock_);
        __GovernorVotesERC721QuorumFractionUpgradeable_init(quorumNumerator_);

        _votingDelay = votingDelay_;
        _votingPeriod = votingPeriod_;
    }

    function votingDelay() public view virtual override returns (uint256) {
        return _votingDelay;
    }

    function votingPeriod() public view virtual override returns (uint256) {
        return _votingPeriod;
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
    ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (uint256) {
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
