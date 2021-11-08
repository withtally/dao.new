// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { ClonesUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import { AddressUpgradeable } from "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import { ERC721DAOToken } from "./token/ERC721DAOToken.sol";
import { ERC721Timelock } from "./governor/ERC721Timelock.sol";
import { ERC721Governor } from "./governor/ERC721Governor.sol";
import { ERC721Minter } from "./minters/ERC721Minter.sol";
import { MintingFilter } from "./minters/filters/MintingFilter.sol";

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
        uint256 implementationIndex;
        uint256 startingBlock;
        uint256 creatorShares;
        uint256 daoShares;
        bytes extraInitCallData;
    }

    ERC721DAOToken public token;
    ERC721Timelock public timelock;
    ERC721Governor public governor;
    ERC721Minter[] public minters;
    MintingFilter[] public mintingFilters;

    event ImplementationsSet(
        address token,
        address timelock,
        address governor,
        address[] minters,
        address[] mintingFilters
    );
    event NewClone(address token, address timelock, address governor, address minter);
    event NewMintingFilterClone(address mintingFilter);

    function initialize(
        ERC721DAOToken token_,
        ERC721Timelock timelock_,
        ERC721Governor governor_,
        ERC721Minter[] calldata minters_,
        MintingFilter[] calldata mintingFilters_
    ) public initializer {
        __Ownable_init();

        _setImplementations(token_, timelock_, governor_, minters_, mintingFilters_);
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
        ERC721Minter minterClone = ERC721Minter(payable(address(minters[minterParams.implementationIndex]).clone()));

        {
            bytes32[] memory roles = new bytes32[](5);
            roles[0] = token.getAdminsAdminRole();
            roles[1] = token.getMinterAdminRole();
            roles[2] = token.getBurnerAdminRole();
            roles[3] = token.getBaseURIAdminRole();
            roles[4] = token.getMinterRole();

            address[] memory rolesAssignees = new address[](5);
            rolesAssignees[0] = creatorAddress;
            rolesAssignees[1] = creatorAddress;
            rolesAssignees[2] = creatorAddress;
            rolesAssignees[3] = creatorAddress;
            rolesAssignees[4] = address(minterClone);

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

            minterClone.initialize(
                creatorAddress,
                tokenClone,
                minterParams.startingBlock,
                payees,
                shares,
                minterParams.extraInitCallData
            );
        }

        emit NewClone(address(tokenClone), address(timelockClone), address(governorClone), address(minterClone));
    }

    function cloneMintingFilter(uint256 implIndex, bytes calldata initData) external returns (address) {
        require(implIndex < mintingFilters.length, "ERC721DAODeployer: implIndex out of bounds");

        address newClone = address(mintingFilters[implIndex]).clone();
        newClone.functionCall(initData);

        emit NewMintingFilterClone(newClone);

        return newClone;
    }

    function setImplementations(
        ERC721DAOToken token_,
        ERC721Timelock timelock_,
        ERC721Governor governor_,
        ERC721Minter[] calldata minters_,
        MintingFilter[] calldata mintingFilters_
    ) external onlyOwner {
        _setImplementations(token_, timelock_, governor_, minters_, mintingFilters_);
    }

    function _setImplementations(
        ERC721DAOToken token_,
        ERC721Timelock timelock_,
        ERC721Governor governor_,
        ERC721Minter[] calldata minters_,
        MintingFilter[] calldata mintingFilters_
    ) internal {
        token = token_;
        timelock = timelock_;
        governor = governor_;
        minters = minters_;
        mintingFilters = mintingFilters_;

        emit ImplementationsSet(
            address(token_),
            address(timelock_),
            address(governor_),
            mintersToAddresses(minters_),
            mintingFiltersToAddresses(mintingFilters_)
        );
    }

    function mintersToAddresses(ERC721Minter[] calldata minters_) private pure returns (address[] memory) {
        address[] memory addrs = new address[](minters_.length);
        for (uint256 i = 0; i < minters_.length; i++) {
            addrs[i] = address(minters_[i]);
        }
        return addrs;
    }

    function mintingFiltersToAddresses(MintingFilter[] calldata mintingFilters_)
        private
        pure
        returns (address[] memory)
    {
        address[] memory addrs = new address[](mintingFilters_.length);
        for (uint256 i = 0; i < mintingFilters_.length; i++) {
            addrs[i] = address(mintingFilters_[i]);
        }
        return addrs;
    }
}
