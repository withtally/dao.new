// SPDX-License-Identifier: MIT

// LICENSE
// GovernorVotesERC721QuorumFractionUpgradeable.sol modifies OpenZeppelin's GovernorVotesQuorumFractionUpgradeable.sol:
// https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/governance/extensions/GovernorVotesQuorumFractionUpgradeable.sol
//
// GovernorVotesQuorumFractionUpgradeable.sol source code copyright OpenZeppelin licensed under the MIT License.

pragma solidity ^0.8.0;

import { GovernorVotesERC721Upgradeable } from "./GovernorVotesERC721Upgradeable.sol";
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 * @dev Extension of {Governor} for voting weight extraction from an {ERC20Votes} token and a quorum expressed as a
 * fraction of the total supply.
 */
abstract contract GovernorVotesERC721QuorumFractionUpgradeable is Initializable, GovernorVotesERC721Upgradeable {
    uint256 private _quorumNumerator;

    event QuorumNumeratorUpdated(uint256 oldQuorumNumerator, uint256 newQuorumNumerator);

    function __GovernorVotesERC721QuorumFractionUpgradeable_init(uint256 quorumNumeratorValue)
        internal
        onlyInitializing
    {
        __Context_init_unchained();
        __ERC165_init_unchained();
        __IGovernor_init_unchained();
        __GovernorVotesERC721QuorumFractionUpgradeable_init_unchained(quorumNumeratorValue);
    }

    function __GovernorVotesERC721QuorumFractionUpgradeable_init_unchained(uint256 quorumNumeratorValue)
        internal
        onlyInitializing
    {
        _updateQuorumNumerator(quorumNumeratorValue);
    }

    function quorumNumerator() public view virtual returns (uint256) {
        return _quorumNumerator;
    }

    function quorumDenominator() public view virtual returns (uint256) {
        return 100;
    }

    function quorum(uint256 blockNumber) public view virtual override returns (uint256) {
        return (token.getPastTotalSupply(blockNumber) * quorumNumerator()) / quorumDenominator();
    }

    function updateQuorumNumerator(uint256 newQuorumNumerator) external virtual onlyGovernance {
        _updateQuorumNumerator(newQuorumNumerator);
    }

    function _updateQuorumNumerator(uint256 newQuorumNumerator) internal virtual {
        require(
            newQuorumNumerator <= quorumDenominator(),
            "GovernorVotesQuorumFraction: quorumNumerator over quorumDenominator"
        );

        uint256 oldQuorumNumerator = _quorumNumerator;
        _quorumNumerator = newQuorumNumerator;

        emit QuorumNumeratorUpdated(oldQuorumNumerator, newQuorumNumerator);
    }

    uint256[49] private __gap;
}
