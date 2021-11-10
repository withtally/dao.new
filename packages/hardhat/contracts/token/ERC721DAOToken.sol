// SPDX-License-Identifier: GPL-3.0

/// @title ERC-721 token for DAOs.

pragma solidity ^0.8.6;

import "./ERC721CheckpointableUpgradable.sol";
import "../lib/SVGPlaceholder.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

contract ERC721DAOToken is ERC721CheckpointableUpgradable, AccessControlEnumerableUpgradeable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant MINTER_ADMIN_ROLE = keccak256("MINTER_ADMIN_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant BURNER_ADMIN_ROLE = keccak256("BURNER_ADMIN_ROLE");
    bytes32 public constant BASE_URI_ROLE = keccak256("BASE_URI_ROLE");
    bytes32 public constant BASE_URI_ADMIN_ROLE = keccak256("BASE_URI_ADMIN_ROLE");
    bytes32 public constant ADMINS_ADMIN_ROLE = keccak256("ADMINS_ADMIN_ROLE");

    string public baseURI;
    string private contractInfoFilename;
    bool public baseURIEnabled;

    event BaseURIChanged(string newURI);
    event ContractInfoFilenameChanged(string newFilename);
    event BaseURIEnabledChanged(bool baseURIEnabled);

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721EnumerableUpgradeable, AccessControlEnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        bytes32[] memory roles,
        address[] memory rolesAssignees
    ) public initializer {
        require(roles.length == rolesAssignees.length, "ERC721DAOToken::initializer: roles assignment arity mismatch");

        __ERC721_init(name_, symbol_);
        baseURI = baseURI_;
        contractInfoFilename = "project.json";

        _setRoleAdmin(ADMINS_ADMIN_ROLE, ADMINS_ADMIN_ROLE);
        _setRoleAdmin(MINTER_ADMIN_ROLE, ADMINS_ADMIN_ROLE);
        _setRoleAdmin(BURNER_ADMIN_ROLE, ADMINS_ADMIN_ROLE);
        _setRoleAdmin(BASE_URI_ADMIN_ROLE, ADMINS_ADMIN_ROLE);
        _setRoleAdmin(MINTER_ROLE, MINTER_ADMIN_ROLE);
        _setRoleAdmin(BURNER_ROLE, BURNER_ADMIN_ROLE);
        _setRoleAdmin(BASE_URI_ROLE, BASE_URI_ADMIN_ROLE);

        // assign roles
        for (uint256 i = 0; i < roles.length; i++) {
            _setupRole(roles[i], rolesAssignees[i]);
        }
    }

    function mint(address to, uint256 tokenId) public onlyRole(MINTER_ROLE) {
        _safeMint(to, tokenId);
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

    function setContractInfoFilename(string memory contractInfoFilename_) public onlyRole(BASE_URI_ROLE) {
        contractInfoFilename = contractInfoFilename_;
        emit ContractInfoFilenameChanged(contractInfoFilename_);
    }

    /**
     * @notice The IPFS URI of the project's metadata.
     */
    function contractInfoURI() public view returns (string memory) {
        return string(abi.encodePacked(baseURI, contractInfoFilename));
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

    function getBurnerRole() external pure returns (bytes32) {
        return BURNER_ROLE;
    }

    function getBurnerAdminRole() external pure returns (bytes32) {
        return BURNER_ADMIN_ROLE;
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
}
