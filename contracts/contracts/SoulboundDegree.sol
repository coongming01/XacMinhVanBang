// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title SoulboundDegree
 * @author XacMinhVanBang Team
 * @notice Soulbound Token (SBT) representing academic degrees.
 *         These tokens are non-transferable — once minted to a student,
 *         they cannot be moved to another wallet.
 * @dev Inherits ERC721, ERC721URIStorage, ERC721Enumerable, AccessControl.
 *      Transfers are blocked by overriding the `_update` hook (OZ v5 pattern).
 */
contract SoulboundDegree is ERC721, ERC721URIStorage, ERC721Enumerable, AccessControl {

    /// @notice Role identifier for accounts allowed to mint and revoke degrees
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @dev Auto-incrementing counter for token IDs (starts at 1)
    uint256 private _nextTokenId;

    /// @notice Custom error: SBTs cannot be transferred
    error SBTTransferNotAllowed();

    /**
     * @notice Deploy the SoulboundDegree contract.
     * @param admin The address that receives DEFAULT_ADMIN_ROLE and MINTER_ROLE.
     */
    constructor(address admin) ERC721("SoulboundDegree", "SBD") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _nextTokenId = 1; // Token IDs start at 1
    }

    // =========================================================================
    //                              MINTING
    // =========================================================================

    /**
     * @notice Mint a single Soulbound Degree to a student.
     * @param to      The recipient wallet address (student).
     * @param uri     The metadata URI (points to IPFS / off-chain JSON).
     * @return tokenId The newly minted token ID.
     */
    function mint(address to, string memory uri)
        external
        onlyRole(MINTER_ROLE)
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        return tokenId;
    }

    /**
     * @notice Batch-mint Soulbound Degrees to multiple students in one transaction.
     * @param recipients Array of recipient wallet addresses.
     * @param uris       Array of metadata URIs (must match recipients length).
     * @return tokenIds  Array of newly minted token IDs.
     */
    function batchMint(
        address[] calldata recipients,
        string[] calldata uris
    )
        external
        onlyRole(MINTER_ROLE)
        returns (uint256[] memory)
    {
        require(recipients.length == uris.length, "SBD: arrays length mismatch");
        require(recipients.length > 0, "SBD: empty arrays");

        uint256[] memory tokenIds = new uint256[](recipients.length);

        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 tokenId = _nextTokenId;
            _nextTokenId++;

            _safeMint(recipients[i], tokenId);
            _setTokenURI(tokenId, uris[i]);

            tokenIds[i] = tokenId;
        }

        return tokenIds;
    }

    // =========================================================================
    //                              REVOCATION
    // =========================================================================

    /**
     * @notice Revoke (burn) a degree. Only callable by MINTER_ROLE.
     * @param tokenId The token ID to revoke.
     */
    function revoke(uint256 tokenId) external onlyRole(MINTER_ROLE) {
        _burn(tokenId);
    }

    // =========================================================================
    //                              VIEW FUNCTIONS
    // =========================================================================

    /**
     * @notice Check whether a token with the given ID exists.
     * @param tokenId The token ID to check.
     * @return True if the token exists, false otherwise.
     */
    function exists(uint256 tokenId) external view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @notice Get all token IDs owned by a specific address.
     * @param owner The address to query.
     * @return An array of token IDs owned by `owner`.
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 count = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }

        return tokenIds;
    }

    // =========================================================================
    //                         SOULBOUND ENFORCEMENT
    // =========================================================================

    /**
     * @dev Override the internal `_update` hook to block all transfers.
     *      Minting (from == address(0)) and burning (to == address(0)) are allowed.
     *      Any other transfer reverts with SBTTransferNotAllowed.
     *
     *      This is the OpenZeppelin v5 pattern for transfer hooks.
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        address from = _ownerOf(tokenId);

        // Block transfers: allow only mint (from == 0) and burn (to == 0)
        if (from != address(0) && to != address(0)) {
            revert SBTTransferNotAllowed();
        }

        return super._update(to, tokenId, auth);
    }

    // =========================================================================
    //                       REQUIRED OVERRIDES (OZ v5)
    // =========================================================================

    /**
     * @dev Override required by ERC721Enumerable.
     */
    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    /**
     * @dev Override required by ERC721URIStorage.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Override required to resolve AccessControl + ERC721 + ERC721URIStorage + ERC721Enumerable.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
