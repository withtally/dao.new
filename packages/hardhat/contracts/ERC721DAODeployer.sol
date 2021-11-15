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
import { IRoyaltyInfo } from "./token/IRoyaltyInfo.sol";

contract ERC721DAODeployer is OwnableUpgradeable {
    using ClonesUpgradeable for address;
    using AddressUpgradeable for address;

    struct TokenParams {
        string name;
        string symbol;
        string baseURI;
        string contractInfoURI;
        uint256 royaltiesBPs;
        address royaltiesRecipientOverride;
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

    struct MintingFilterParams {
        bool useMintingFilter;
        uint256 implementationIndex;
        bytes initCallData;
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
    event NewClone(address token, address timelock, address governor, address minter, address mintingFilter);

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
        MinterParams calldata minterParams,
        MintingFilterParams calldata mintingFilterParams
    ) external {
        require(
            minterParams.implementationIndex < minters.length,
            "ERC721DAODeployer: minter implementationIndex out of bounds"
        );

        ERC721DAOToken tokenClone = ERC721DAOToken(address(token).clone());
        ERC721Timelock timelockClone = ERC721Timelock(payable(address(timelock).clone()));
        ERC721Governor governorClone = ERC721Governor(address(governor).clone());
        ERC721Minter minterClone = ERC721Minter(payable(address(minters[minterParams.implementationIndex]).clone()));

        // This block is necessary to avoid the "stack too deep" compilation error
        {
            IRoyaltyInfo.RoyaltyInfo memory royaltyInfo = IRoyaltyInfo.RoyaltyInfo(
                address(timelockClone),
                tokenParams.royaltiesBPs
            );
            if (tokenParams.royaltiesRecipientOverride != address(0)) {
                royaltyInfo.recipient = tokenParams.royaltiesRecipientOverride;
            }

            initToken(tokenClone, minterClone, creatorAddress, tokenParams, royaltyInfo);
        }

        initTimelock(timelockClone, governorClone, governorParams.timelockDelay);
        governorClone.initialize(
            governorParams.name,
            tokenClone,
            timelockClone,
            governorParams.proposalThreshold,
            governorParams.votingDelay,
            governorParams.votingPeriod,
            governorParams.quorumNumerator
        );

        MintingFilter mintingFilter = cloneAndInitMintingFilter(mintingFilterParams);
        initMinter(minterClone, timelockClone, tokenClone, minterParams, creatorAddress, mintingFilter);

        emit NewClone(
            address(tokenClone),
            address(timelockClone),
            address(governorClone),
            address(minterClone),
            address(mintingFilter)
        );
    }

    function initToken(
        ERC721DAOToken tokenClone,
        ERC721Minter minterClone,
        address creatorAddress,
        TokenParams calldata tokenParams,
        IRoyaltyInfo.RoyaltyInfo memory royaltyInfo
    ) private {
        (bytes32[] memory roles, address[] memory rolesAssignees) = generateTokenRolesAndAssignees(
            tokenClone,
            creatorAddress,
            minterClone
        );

        tokenClone.initialize(
            tokenParams.name,
            tokenParams.symbol,
            tokenParams.baseURI,
            tokenParams.contractInfoURI,
            roles,
            rolesAssignees,
            royaltyInfo
        );
    }

    function initTimelock(
        ERC721Timelock timelockClone,
        ERC721Governor governorClone,
        uint256 timelockDelay
    ) private {
        address[] memory proposers = new address[](1);
        proposers[0] = address(governorClone);
        address[] memory executors = new address[](1);
        executors[0] = address(0);

        timelockClone.initialize(timelockDelay, proposers, executors);
    }

    function initMinter(
        ERC721Minter minterClone,
        ERC721Timelock timelockClone,
        ERC721DAOToken tokenClone,
        MinterParams calldata minterParams,
        address creatorAddress,
        MintingFilter mintingFilter
    ) private {
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
            mintingFilter,
            minterParams.extraInitCallData
        );
    }

    function cloneAndInitMintingFilter(MintingFilterParams calldata mintingFilterParams)
        private
        returns (MintingFilter)
    {
        if (!mintingFilterParams.useMintingFilter) {
            return MintingFilter(address(0));
        }
        require(
            mintingFilterParams.implementationIndex < mintingFilters.length,
            "ERC721DAODeployer: mintingFilter implementationIndex out of bounds"
        );

        address newClone = address(mintingFilters[mintingFilterParams.implementationIndex]).clone();
        newClone.functionCall(mintingFilterParams.initCallData);

        return MintingFilter(newClone);
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

    function generateTokenRolesAndAssignees(
        ERC721DAOToken token_,
        address creatorAddress,
        ERC721Minter minterClone
    ) private pure returns (bytes32[] memory, address[] memory) {
        bytes32[] memory roles = new bytes32[](7);
        roles[0] = token_.getAdminsAdminRole();
        roles[1] = token_.getMinterAdminRole();
        roles[2] = token_.getBaseURIAdminRole();
        roles[3] = token_.getRoyaltiesAdminRole();
        roles[4] = token_.getBaseURIRole();
        roles[5] = token_.getMinterRole();
        roles[6] = token_.getRoyaltiesRole();

        address[] memory rolesAssignees = new address[](7);
        rolesAssignees[0] = creatorAddress;
        rolesAssignees[1] = creatorAddress;
        rolesAssignees[2] = creatorAddress;
        rolesAssignees[3] = creatorAddress;
        rolesAssignees[4] = creatorAddress;
        rolesAssignees[5] = address(minterClone);
        rolesAssignees[6] = creatorAddress;

        return (roles, rolesAssignees);
    }
}
