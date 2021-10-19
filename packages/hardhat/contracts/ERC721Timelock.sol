// SPDX-License-Identifier: GPL-3.0

/// @title Timelock for ERC721Governor.

pragma solidity ^0.8.6;

import { TimelockControllerUpgradeable } from "@openzeppelin/contracts-upgradeable/governance/TimelockControllerUpgradeable.sol";

contract ERC721Timelock is TimelockControllerUpgradeable {
    function initialize(
        uint256 minDelay,
        address initialAdmin,
        address[] memory proposers,
        address[] memory executors
    ) public initializer {
        __TimelockController_init(minDelay, proposers, executors);

        // __TimelockController_init sets _msgSender as admin
        // When cloning this contract, _msgSender is CloneFactory
        // We don't want CloneFactory to have admin rights with all the timelocks it creates
        // Instead we add an initialAdmin, that can be the deployer just until they can
        // set the Governor as the sole proposer and then revoke themselves.
        revokeRole(TIMELOCK_ADMIN_ROLE, _msgSender());
        _setupRole(TIMELOCK_ADMIN_ROLE, initialAdmin);
    }
}
