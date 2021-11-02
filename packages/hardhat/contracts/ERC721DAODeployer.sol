// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { ClonesUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import { AddressUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import { ERC721DAOToken } from "./ERC721DAOToken.sol";
import { ERC721Timelock } from "./ERC721Timelock.sol";
import { ERC721Governor } from "./ERC721Governor.sol";
import { IERC721Minter } from "./IERC721Minter.sol";

contract ERC721DAODeployer is OwnableUpgradeable {
    using ClonesUpgradeable for address;
    using AddressUpgradeable for address;

    struct TokenParams {
        string name;
        string symbol;
        string baseURI;
    }

    struct GovernorParams {
        string name;
        uint256 proposalThreshold;
        uint256 votingDelay;
        uint256 votingPeriod;
        uint256 quorumNumerator;
        uint256 timelockDelay;
    }

    struct MinterParams {
        uint256 startingBlock;
        uint256 creatorShares;
        uint256 daoShares;
        bytes extraInitCallData;
        uint256 extraInitValue;
    }

    ERC721DAOToken public token;
    ERC721Timelock public timelock;
    ERC721Governor public governor;
    IERC721Minter public minter;

    event ImplementationsSet(address token, address timelock, address governor, address minter);
    event NewClone(address token, address timelock, address governor, address minter);

    function initialize(
        ERC721DAOToken token_,
        ERC721Timelock timelock_,
        ERC721Governor governor_,
        IERC721Minter minter_
    ) public initializer {
        __Ownable_init();

        _setImplementations(token_, timelock_, governor_, minter_);
    }

    function clone(
        address creatorAddress,
        TokenParams calldata tokenParams,
        GovernorParams calldata governorParams,
        MinterParams calldata minterParams
    ) external {
        ERC721DAOToken tokenClone = ERC721DAOToken(address(token).clone());
        ERC721Timelock timelockClone = ERC721Timelock(payable(address(timelock).clone()));
        ERC721Governor governorClone = ERC721Governor(address(governor).clone());
        IERC721Minter minterClone = IERC721Minter(payable(address(minter).clone()));

        {
            bytes32[] memory roles = new bytes32[](2);
            roles[0] = token.getAdminRole();
            roles[1] = token.getMinterRole();

            address[] memory rolesAssignees = new address[](2);
            rolesAssignees[0] = address(timelockClone);
            rolesAssignees[1] = address(minterClone);

            tokenClone.initialize(tokenParams.name, tokenParams.symbol, tokenParams.baseURI, roles, rolesAssignees);
        }

        {
            address[] memory proposers = new address[](1);
            proposers[0] = address(governorClone);
            address[] memory executors = new address[](1);
            executors[0] = address(0);

            timelockClone.initialize(governorParams.timelockDelay, proposers, executors);
        }

        governorClone.initialize(
            governorParams.name,
            tokenClone,
            timelockClone,
            governorParams.proposalThreshold,
            governorParams.votingDelay,
            governorParams.votingPeriod,
            governorParams.quorumNumerator
        );

        {
            address[] memory payees = new address[](2);
            payees[0] = creatorAddress;
            payees[1] = address(timelockClone);

            uint256[] memory shares = new uint256[](2);
            shares[0] = minterParams.creatorShares;
            shares[1] = minterParams.daoShares;

            minterClone.initialize(creatorAddress, tokenClone, minterParams.startingBlock, payees, shares);
            address(minterClone).functionCallWithValue(minterParams.extraInitCallData, minterParams.extraInitValue);
        }

        emit NewClone(address(tokenClone), address(timelockClone), address(governorClone), address(minterClone));
    }

    function setImplementations(
        ERC721DAOToken token_,
        ERC721Timelock timelock_,
        ERC721Governor governor_,
        IERC721Minter minter_
    ) external onlyOwner {
        _setImplementations(token_, timelock_, governor_, minter_);
    }

    function _setImplementations(
        ERC721DAOToken token_,
        ERC721Timelock timelock_,
        ERC721Governor governor_,
        IERC721Minter minter_
    ) internal {
        token = token_;
        timelock = timelock_;
        governor = governor_;
        minter = minter_;

        emit ImplementationsSet(address(token_), address(timelock_), address(governor_), address(minter_));
    }
}
