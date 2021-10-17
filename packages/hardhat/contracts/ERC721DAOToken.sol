// SPDX-License-Identifier: GPL-3.0

/// @title ERC-721 token for DAOs.

pragma solidity ^0.8.6;

import "./ERC721CheckpointableUpgradable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

contract ERC721DAOToken is
    ERC721CheckpointableUpgradable,
    AccessControlEnumerableUpgradeable
{
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant BASE_URI_ROLE = keccak256("BASE_URI_ROLE");

    string public baseURI = "";
    string private contractInfoFilename = "project.json";

    event BaseURIChanged(string newURI);
    event ContractInfoFilenameChanged(string newFilename);

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(
            ERC721EnumerableUpgradeable,
            AccessControlEnumerableUpgradeable
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        bytes32[] memory roles,
        address[] memory rolesAssignees
    ) public {
        require(
            roles.length == rolesAssignees.length,
            "ERC721DAOToken::initializer: roles assignment arity mismatch"
        );

        __ERC721_init(name_, symbol_);

        // set roles administrator
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
        _setRoleAdmin(MINTER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(BURNER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(BASE_URI_ROLE, ADMIN_ROLE);

        // assign roles
        for (uint256 i = 0; i < roles.length; i++) {
            _setupRole(roles[i], rolesAssignees[i]);
        }
    }

    function mint(address to, uint256 tokenId) public onlyRole(MINTER_ROLE) {
        _mint(to, tokenId);
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

    function setContractInfoFilename(string memory contractInfoFilename_)
        public
        onlyRole(BASE_URI_ROLE)
    {
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
}
