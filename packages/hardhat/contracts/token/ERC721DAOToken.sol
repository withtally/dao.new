// SPDX-License-Identifier: GPL-3.0

/// @title ERC-721 token for DAOs.

pragma solidity ^0.8.6;

import { ERC721CheckpointableUpgradable, ERC721EnumerableUpgradeable } from "./ERC721CheckpointableUpgradable.sol";
import { SVGPlaceholder } from "../lib/SVGPlaceholder.sol";
import { AccessControlEnumerableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import { ERC2981ContractWideRoyalties } from "./ERC2981ContractWideRoyalties.sol";
import { IRoyaltyInfo } from "./IRoyaltyInfo.sol";
import { IProxyRegistry } from "../lib/IProxyRegistry.sol";

contract ERC721DAOToken is
    ERC721CheckpointableUpgradable,
    ERC2981ContractWideRoyalties,
    AccessControlEnumerableUpgradeable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant MINTER_ADMIN_ROLE = keccak256("MINTER_ADMIN_ROLE");
    bytes32 public constant BASE_URI_ROLE = keccak256("BASE_URI_ROLE");
    bytes32 public constant BASE_URI_ADMIN_ROLE = keccak256("BASE_URI_ADMIN_ROLE");
    bytes32 public constant ROYALTIES_ROLE = keccak256("ROYALTIES_ROLE");
    bytes32 public constant ROYALTIES_ADMIN_ROLE = keccak256("ROYALTIES_ADMIN_ROLE");
    bytes32 public constant PROXY_REGISTRY_ROLE = keccak256("PROXY_REGISTRY_ROLE");
    bytes32 public constant PROXY_REGISTRY_ADMIN_ROLE = keccak256("PROXY_REGISTRY_ADMIN_ROLE");
    bytes32 public constant ADMINS_ADMIN_ROLE = keccak256("ADMINS_ADMIN_ROLE");

    string public baseURI;
    /**
     * @notice The IPFS URI of the project's metadata.
     */
    string public contractInfoURI;
    bool public baseURIEnabled;
    IProxyRegistry public proxyRegistry;
    bool public proxyRegistryEnabled;

    event BaseURIChanged(string newURI);
    event ContractInfoURIChanged(string newContractInfoURI);
    event BaseURIEnabledChanged(bool baseURIEnabled);
    event ProxyRegistryChanged(address newProxyRegistry);
    event ProxyRegistryEnabledChanged(bool proxyRegistryEnabled);

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721EnumerableUpgradeable, ERC2981ContractWideRoyalties, AccessControlEnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        string memory contractInfoURI_,
        bytes32[] memory roles,
        address[] memory rolesAssignees,
        IRoyaltyInfo.RoyaltyInfo memory royaltiesInfo
    ) public initializer {
        require(roles.length == rolesAssignees.length, "ERC721DAOToken::initializer: roles assignment arity mismatch");

        __ERC721_init(name_, symbol_);
        baseURI = baseURI_;
        
        contractInfoURI = contractInfoURI_;
        _setRoyalties(royaltiesInfo.recipient, royaltiesInfo.bps);
        proxyRegistryEnabled = false;

        _setRoleAdmin(ADMINS_ADMIN_ROLE, ADMINS_ADMIN_ROLE);
        _setRoleAdmin(MINTER_ADMIN_ROLE, ADMINS_ADMIN_ROLE);
        _setRoleAdmin(BASE_URI_ADMIN_ROLE, ADMINS_ADMIN_ROLE);
        _setRoleAdmin(ROYALTIES_ADMIN_ROLE, ADMINS_ADMIN_ROLE);
        _setRoleAdmin(PROXY_REGISTRY_ADMIN_ROLE, ADMINS_ADMIN_ROLE);
        _setRoleAdmin(MINTER_ROLE, MINTER_ADMIN_ROLE);
        _setRoleAdmin(BASE_URI_ROLE, BASE_URI_ADMIN_ROLE);
        _setRoleAdmin(ROYALTIES_ROLE, ROYALTIES_ADMIN_ROLE);
        _setRoleAdmin(PROXY_REGISTRY_ROLE, PROXY_REGISTRY_ADMIN_ROLE);

        // assign roles
        for (uint256 i = 0; i < roles.length; i++) {
            _setupRole(roles[i], rolesAssignees[i]);
        }
    }

    function mint(address to, uint256 tokenId) public onlyRole(MINTER_ROLE) {
        _safeMint(to, tokenId);
    }

    /**
     * Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
     */
    function isApprovedForAll(address owner, address operator) public view override returns (bool) {
        // Whitelist OpenSea proxy contract for easy trading.
        if (proxyRegistryEnabled && proxyRegistry.proxies(owner) == operator) {
            return true;
        }

        return super.isApprovedForAll(owner, operator);
    }

    function setProxyRegistryAndEnable(IProxyRegistry proxyRegistry_) public onlyRole(PROXY_REGISTRY_ROLE) {
        setProxyRegistry(proxyRegistry_);
        setProxyRegistryEnabled(true);
    }

    function setProxyRegistry(IProxyRegistry proxyRegistry_) public onlyRole(PROXY_REGISTRY_ROLE) {
        proxyRegistry = proxyRegistry_;
        emit ProxyRegistryChanged(address(proxyRegistry_));
    }

    function setProxyRegistryEnabled(bool proxyRegistryEnabled_) public onlyRole(PROXY_REGISTRY_ROLE) {
        proxyRegistryEnabled = proxyRegistryEnabled_;
        emit ProxyRegistryEnabledChanged(proxyRegistryEnabled_);
    }

    function setRoyalties(address recipient, uint256 bps) public onlyRole(ROYALTIES_ROLE) {
        _setRoyalties(recipient, bps);
    }

    /**
     * @notice Should be an IPFS link to the project folder, which should contain everything the
     * project needs, including:
     * - the project metadata JSON, e.g. ipfs://QmZi1n79FqWt2tTLwCqiy6nLM6xLGRsEPQ5JmReJQKNNzX
     * - all the asset descriptors and media files
     */
    function setBaseURI(string memory baseURI_) public onlyRole(BASE_URI_ROLE) {
        baseURI = baseURI_;
        emit BaseURIChanged(baseURI_);
    }

    function setBaseURIEnabled(bool baseURIEnabled_) public onlyRole(BASE_URI_ROLE) {
        baseURIEnabled = baseURIEnabled_;
        emit BaseURIEnabledChanged(baseURIEnabled_);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (baseURIEnabled) {
            return super.tokenURI(tokenId);
        } else {
            return SVGPlaceholder.placeholderTokenUri(name(), tokenId);
        }
    }

    function setContractInfoURI(string memory contractInfoURI_) public onlyRole(BASE_URI_ROLE) {
        contractInfoURI = contractInfoURI_;
        emit ContractInfoURIChanged(contractInfoURI_);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function getMinterRole() external pure returns (bytes32) {
        return MINTER_ROLE;
    }

    function getMinterAdminRole() external pure returns (bytes32) {
        return MINTER_ADMIN_ROLE;
    }

    function getBaseURIRole() external pure returns (bytes32) {
        return BASE_URI_ROLE;
    }

    function getBaseURIAdminRole() external pure returns (bytes32) {
        return BASE_URI_ADMIN_ROLE;
    }

    function getAdminsAdminRole() external pure returns (bytes32) {
        return ADMINS_ADMIN_ROLE;
    }

    function getRoyaltiesRole() external pure returns (bytes32) {
        return ROYALTIES_ROLE;
    }

    function getRoyaltiesAdminRole() external pure returns (bytes32) {
        return ROYALTIES_ADMIN_ROLE;
    }

    function getProxyRegistryRole() external pure returns (bytes32) {
        return PROXY_REGISTRY_ROLE;
    }

    function getProxyRegistryAdminRole() external pure returns (bytes32) {
        return PROXY_REGISTRY_ADMIN_ROLE;
    }
}
